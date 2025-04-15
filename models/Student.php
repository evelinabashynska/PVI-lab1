<?php

class Student {
    public $id;
    public $group;
    public $firstName;
    public $lastName;
    public $gender;
    public $birthday;

    public function __construct($id, $group, $firstName, $lastName, $gender, $birthday) {
        $this->id = $id;
        $this->group = $group;
        $this->firstName = $firstName;
        $this->lastName = $lastName;
        $this->gender = $gender;
        $this->birthday = $birthday;
    }

    public function toArray() {
        return [
            'id' => $this->id,
            'group' => $this->group,
            'firstName' => $this->firstName,
            'lastName' => $this->lastName,
            'gender' => $this->gender,
            'birthday' => $this->birthday,
        ];
    }
}

?>