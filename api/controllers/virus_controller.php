<?php

require "models/virus.php";
require "mysql.php";


class VirusController {
	public function indexAction(){

		if ($_SERVER['REQUEST_METHOD'] === 'GET')
			return $this->allAction();
		if ($_SERVER['REQUEST_METHOD'] === 'POST')
			return $this->createAction();
	}

	private function allAction(){
		$res = MySQL::get_instance()->query("SELECT * FROM virus LEFT JOIN location ON location.virus_id = virus.id");
		$users = [];

		for ($row_no = $res->num_rows - 1; $row_no >= 0; $row_no--) {
			$res->data_seek($row_no);
			$row = $res->fetch_assoc();
			array_push($users, new Virus($row));
		}

		return $users;
	}

	private function createAction(){
		$virus = new Virus($_POST);
		
		$res = MySQL::get_instance()->query("INSERT INTO virus ()");


	}
}

?>
