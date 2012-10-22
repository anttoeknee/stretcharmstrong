<!doctype html>
<!-- paulirish.com/2008/conditional-stylesheets-vs-css-hacks-answer-neither/ -->
<!--[if lt IE 7]> <html class="no-js lt-ie10 lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie10 lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie10 lt-ie9" lang="en"> <![endif]-->
<!--[if IE 9]>    <html class="ie9 lt-ie10" lang="en"> <![endif]-->
<!-- Consider adding a manifest.appcache: h5bp.com/d/Offline -->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->

<head>
  <meta charset="utf-8">

  <!-- Use the .htaccess and remove these lines to avoid edge case issues.
       More info: h5bp.com/b/378 -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

  <title><?= $title; ?></title>
  <meta name="description" content="<? //$description ?>">
  <meta name="keywords" content="<? //$keywords ?>">
  <meta name="author" content="superarmstrong" />

  <!-- Mobile viewport optimized: j.mp/bplateviewport -->
  <meta name="viewport" content="width=device-width,initial-scale=1">

  <!-- Place favicon.ico and apple-touch-icon.png in the root directory: mathiasbynens.be/notes/touch-icons -->

  <!-- CSS: implied media=all -->
  <!-- CSS concatenated and minified via ant build script-->
  <link rel="stylesheet" href="assets/cms/css/fonts.css">
  <link rel="stylesheet" href="assets/cms/css/theme.css">
  <link rel="stylesheet" href="assets/cms/css/template.css">
  <!-- end CSS-->

  <!-- More ideas for your <head> here: h5bp.com/d/head-Tips -->

  <!-- All JavaScript at the bottom, except for Modernizr / Respond.
       Modernizr enables HTML5 elements & feature detects; Respond is a polyfill for min/max-width CSS3 Media Queries
       For optimal performance, use a custom Modernizr build: www.modernizr.com/download/ -->
  <script src="assets/js/libs/modernizr-2.0.6.min.js"></script>
</head>

<body id="cms-<?= $page ?>">

  <header>
      
      <section class="container">

        <img src="assets/cms/img/logo-cms-small.png" width="299" height="100" alt="Open Tag CMS" class="logo png_bg" />

      </section>
          
  </header>

  <section class="container">

    <div id="main" role="main">

       <?= $content; ?>

    </div>

  </section> 
  <!--! end of #container -->


  <footer>

  </footer>


  <!-- JavaScript at the bottom for fast page loading -->

  <!-- Grab Google CDN's jQuery, with a protocol relative URL; fall back to local if offline -->
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
  <!--<script>window.jQuery || document.write('<script src="/assets/js/libs/jquery-1.6.2.min.js"><\/script>')</script>-->

  <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.0/jquery-ui.min.js"></script>


  <!--[if lt IE 10]>
  <script type="text/javascript" src="assets/cms/js/lib/pie.js"></script>
  <![endif]-->


  <!-- scripts concatenated and minified via ant build script-->
  <script defer src="assets/cms/js/script.js"></script>
  <!-- end scripts-->

	
  <!-- Prompt IE 6 users to install Chrome Frame. Remove this if you want to support IE 6.
       chromium.org/developers/how-tos/chrome-frame-getting-started -->
  <!--[if lt IE 7 ]>
    <script src="//ajax.googleapis.com/ajax/libs/chrome-frame/1.0.3/CFInstall.min.js"></script>
    <script>window.attachEvent('onload',function(){CFInstall.check({mode:'overlay'})})</script>
  <![endif]-->
  
</body>
</html>
