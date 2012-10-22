<?php

namespace CMS;

class Controller_Login extends \Controller_Template
{

	private function create_login_form()
	{
		// Create form (no point in modelling form for three fields)
		$fieldset = \Fieldset::forge('frm-login', array(
			'form_attributes' => array(
				'id'     => 'frm-login',
				'name'   => 'frm-login',
				'action' => \Request::main()->uri->base(false) . 'cms/login/process'
				)
			)
		); 

		// Add fields
	    $fieldset->add('txt-username', '', array(
	    	'type'        => 'text', 
	   		'placeholder' => 'username',
	    	'class'       => 'text medium pie'
	    	)
	    );

	    $fieldset->add('txt-password', '', array(
	    	'type'        => 'password', 
	    	'placeholder' => 'password', 
	    	'class'       => 'text medium pie'
	    	)
	    );

	    $fieldset->add('btn-submit', '', array(
	    	'type'  => 'submit', 
	    	'value' => 'submit', 
	    	'class' => 'submit small pie'
	    	)
	    );

	    return $fieldset;
	}

	public function action_auth()
	{

		\Session::set('logged_in', false); ## Debug...
		
		// If were not logged in...
		if (!\Session::get('logged_in') || null)
		{

			// Set page
			\View::set_global('page', 'login');
						
			$view = \View::forge('login');

			// Create login form...
			$fieldset = $this->create_login_form();

			// Set the fieldset to the view
			$view->set('fieldset', $fieldset, false);

			$this->template->title = "Open Tag CMS Login";
			$this->template->content = $view;

		} else {

			// Set page
			\View::set_global('page', 'dashboard');

			//$menus = Model_Menu::get_menus();

			// Load the index view...
			$this->template->title = "Open Tag CMS Dashboard";
			$this->template->content = \View::forge('index', array(
    			//'menus' => $menus
    		));


		}


	}

	public function action_process()
	{
		var_dump("process method");
		$result = \DB::query('SELECT * FROM tbl_users')->execute();
		echo '<pre>';
		var_dump($result);
		echo '</pre>';
		die();
	}

	public function after($response) 
	{

		/*try {
			\View::forge('inc/meta')->render();
		}
		catch (Exception $e) {

		}*/

		return parent::after($response);
	}


}
