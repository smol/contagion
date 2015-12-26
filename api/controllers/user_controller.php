<?php

require "mysql.php";
require "models/user.php";

class UserController {
	public function indexAction(){
		$res = MySQL::get_instance()->query("SELECT * FROM user");
		$users = [];

		for ($row_no = $res->num_rows - 1; $row_no >= 0; $row_no--) {
			$res->data_seek($row_no);
			$row = $res->fetch_assoc();
			array_push($users, new User($row));
		}

		return $users;
	}
}

?>
