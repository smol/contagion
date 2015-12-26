<?php

	$controller = 'index';
	$action = 'index';

	if ($_GET['controller'])
		$controller = $_GET['controller'];

	if ($_GET['action'])
		$action = $_GET['action'];


	require_once('controllers/' . $controller . '_controller.php');

	$controller_name = ucfirst($controller) . "Controller";

	$controller = new $controller_name();

	echo json_encode($controller->{ $action . "Action" }());

?>
