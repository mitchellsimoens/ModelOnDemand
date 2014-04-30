<?php

/**
 * I do provide the data.sql for the test I ran here.
 */

$host     = 'localhost';
$port     = 3306;
$username = 'root';
$password = 'heartbleed'; //not really :)
$dbname   = 'test';

$mysqli = new mysqli($host, $username, $password, $dbname, $port);

// get the total count of users
$sql    = 'SELECT COUNT(*) as total_users FROM users;';
$result = $mysqli->query($sql);
$total  = $result->fetch_assoc();

// get the users for the page
$start  = $_REQUEST['page'] - 1;
$limit  = $_REQUEST['limit'];
$sql    = 'SELECT * FROM users ORDER BY lastName LIMIT ' . $start . ',' . $limit . ';';
$result = $mysqli->query($sql);
$users  = array();

while ($user = $result->fetch_assoc()) {
    $users[] = $user;
}

$ret = array(
    'success' => TRUE,
    'total'   => (int)$total['total_users'],
    'data'    => $users
);

if (isset($_REQUEST['needsModel'])) {
    // need model field data
    $sql    = 'SHOW COLUMNS FROM users;';
    $result = $mysqli->query($sql);
    $fields = array();

    /**
     * This mapping turns the field Type into what Ext JS expects for the field type.
     *
     * For valid Ext JS field types, please see Ext.data.field.Field: http://docs.sencha.com/ext/5.0.0/apidocs/#!/api/Ext.data.field.Field
     *
     * Do note, opting into a conversion via the type config may decrease performance so only use it if the data being
     * returned in the response is not the same type as you need client side. For example, if the data is being returned
     * as a string, no need to convert it to a string. For more on this: http://mitchellsimoens.com/2014/03/19/tiny-performance-boost-in-data-drive-ext-jssencha-touch-apps/
     */
    $typeMap = array(
        'int' => 'int'
    );

    while ($field = $result->fetch_assoc()) {
        $fieldCfg = array(
            'name' => $field['Field']
        );

        preg_match('/^[a-zA-Z]+/', $field['Type'], $typeMatches);  // `Type` will be like `int(5)` so we only need `int

        if (($type = $typeMatches[0]) && isset($typeMap[$type])) {
            $fieldCfg['type'] = $typeMap[$type]; // field type found in map
        }

        $fields[] = $fieldCfg;
    }

    $ret['metaData'] = array(
        'fields' => $fields
    );
}

header('Content-Type: application/json');

echo json_encode($ret);

$mysqli->close();
