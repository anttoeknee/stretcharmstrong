<?php

class Controller_Background extends Controller_Rest {

	public function before() {
	
            // Throw the exception when invalid request (404 error).
	    if (!\Input::is_ajax()) {
	        throw new \Request404Exception();
	    }
	
            // safely build directory path
	    $this->directory = DOCROOT . 'assets/img/transitions/';
	    $this->folder = realpath($this->directory . Input::get('p'));
	
	    // set default
	    if ($this->folder == false) {
	    	$this->folder = 'index';
	    } 
	
	    $this->path    = $this->directory . basename($this->folder);
	    $this->js_path = 'assets/img/transitions/' . basename($this->folder);
	
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
                                $this->bg_images[] = $file_path;
                    	}
	
	                $this->response(array(
                        	'result' => 'success',
                        	'images' => $this->bg_images 
	                ));
	
	        }

                /* 
                Invalid path exception, wont throw unless someone is trying to be cheeky
               as we supply a default for input and are also using basename and realpath
                */
                catch(InvalidPathException $e) {

                        $this->response(array(
                                'result' => 'error',
                                'message' => 'I am an angry exception! Grrrr!'
                        ));
                                
                }

                // all other exceptions...
                catch(Exception $e) {

                        $this->response(array(
                                'result' => 'error',
                                'message' => $e->getMessage()
                        ));

                }

        }


}
