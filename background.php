<?php

Class Controller_Background extends \Controller_Rest {

	public function before() {

		// Throw the exception when invalid request (404 error).
	    if (!\Input::is_ajax()) {
	        throw new \Request404Exception();
	    }

		// Get page from request
		$this->folder = Input::get('p', 'index');

		// Build directory path
		$this->path    = DOCROOT . 'assets/templates/funkin/img/backgrounds/' . $this->folder;
		$this->js_path = 'assets/templates/funkin/img/backgrounds/' . $this->folder;

		$this->bg_images = array();

		parent::before();

	}


	public function get_images() {

		try { 

			// Scan directory (jpg and png only)
			$images = File::read_dir($this->path, 0, array(
				'\.png$'  => 'file',
				'\.jpg$'  => 'file',
				)
			);

			foreach ($images as $image) {

	          	// Build a full file path
	          	$file_path = $this->js_path . '/' .$image;
	          	array_push($this->bg_images, $file_path);
		        
		    }

		    $this->response(array(
		    	'result' => 'success', 
		    	'images' => $this->bg_images
		    ));

		} 

		catch(Exception $e) {

			$this->response(array(
				'result' => 'error', 
				'message' => $e->getMessage()
			));

		} 


	}

}