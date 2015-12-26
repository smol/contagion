<?php

require_once("config.inc.php");

class MySQL {
	private static $instance;

	private $connection;

	public function __construct(){
		global $array;

		$this->connection = new mysqli(
			$array['database']['host'],
			$array['database']['user'],
			$array['database']['password'],
			$array['database']['database']
		);

		if ($this->connection->connect_error)
			die("Connection failed :" . $this->connection->connect_error);
	}

	public static function get_instance(){
		if (!MySQL::$instance)
			MySQL::$instance = new MySQL();
		return MySQL::$instance;
	}

	public function query($sql){
		$res = $this->connection->query($sql);

		return $res;
	}
}
?>
