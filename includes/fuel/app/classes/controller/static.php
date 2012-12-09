<?php

## This controller class will handle all view requests via 'routes'
## all traffic directed to action_index regardless of page

class Controller_Static extends Controller_Template
{

	public function before() 
	{

		// Get URI parts...
		$this->uri_segments = Request::main()->uri->get_segments();
		$this->uri = implode('/', $this->uri_segments);

		parent::before();
	}

	public function action_index()
	{ 

		try {

			// If no uri is supplied, use index as default...
			$this->uri = strlen($this->uri) > 0 ? $this->uri : 'home';

			// Determine page title... (assuming dashed naming convention)
			$page_title = ucwords(str_replace('-', ' ', $this->uri));

			// Set title, content and try to load view
	        $this->template->title = $page_title;
	        $this->template->content = \View::forge($this->uri);

	    } 
	    catch (Exception $e) {

	    	// Templated 404
			$this->template->title = '404';
	        $this->template->content = \View::forge('404');

	    }
	}

	public function after($response)
    {

    	// Try to load meta include...
    	/*try {
    		\View::forge('inc/meta')->render();
    	}
    	catch (Exception $e) {
    		echo "<pre>";
    		var_dump($e);
    		echo "</pre>";
    		die();
    	}*/

    	// Load meta data... (Eventually swap this out for DB managed meta data)
    	


        $response = parent::after($response); 
		return $response; 
    }
}
