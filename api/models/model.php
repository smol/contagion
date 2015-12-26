<?php

class Model implements JsonSerializable {
	public function __construct($sql_object){

		foreach ($this as $key => $value) {
			$this->{$key} = $sql_object[$key];
		}
	}

	public function jsonSerialize(){
		$array = [];

		foreach ($this as $key => $value) {
			$array[$key] = $this->{$key};
		}

		return $array;
	}
}

 ?>
