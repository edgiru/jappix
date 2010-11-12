<?php

/*

Jappix - An open social platform
This is the file get script

~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

License: AGPL
Author: Valérian Saliou
Contact: http://project.jappix.com/contact
Last revision: 10/11/10

*/

// We get the needed files
define('PHP_BASE', '..');
require_once('./functions.php');
require_once('./functions-get.php');
require_once('./read-main.php');
require_once('./read-hosts.php');

// Hide PHP errors
hideErrors();

// If we run developer mode, disable any browser caching
$is_developer = isDeveloper();

if($is_developer) {
	header('Expires: Sat, 26 Jul 1997 05:00:00 GMT');
	header('Cache-Control: no-store, no-cache, must-revalidate');
	header('Cache-Control: post-check=0, pre-check=0', false);
	header('Pragma: no-cache');
}

// Else, we put a far away cache date (1 year)
else {
	$expires = 60*60*24*365;
	header('Pragma: public');
	header('Cache-Control: maxage='.$expires);
	header('Expires: '.gmdate('D, d M Y H:i:s', time()+$expires).' GMT');
}

// Initialize the vars
$type = '';
$file = '';

// Read the type var
if(isset($_GET['t']) && !empty($_GET['t']) && preg_match('/^(css|js|img|snd|store)$/', $_GET['t']))
	$type = $_GET['t'];

// Read the files var
if(isset($_GET['f']) && !empty($_GET['f']) && isSafe($_GET['f']))
	$file = $_GET['f'];

// Read the group var (only for text files)
if(isset($_GET['g']) && !empty($_GET['g']) && preg_match('/^(\S+)\.xml$/', $_GET['g']) && preg_match('/^(css|js)$/', $type) && isSafe($_GET['g']) && file_exists('../xml/'.$_GET['g'])) {
	$xml_data = file_get_contents('../xml/'.$_GET['g']);
	
	// Any data?
	if($xml_data) {
		$xml_read = new SimpleXMLElement($xml_data);
		$xml_parse = $xml_read->$type;
		
		// Files were added to the list before (with file var)?
		if($file)
			$file .= '~'.$xml_parse;
		else
			$file = $xml_parse;
	}
}

// We check if the data was submitted
if($file && $type) {
	// We define some stuffs
	$dir = '../'.$type.'/';
	$path = $dir.$file;
	
	// Define the real type if this is a "store" file
	if($type == 'store') {
		// Extract the file extension
		switch(getFileExt($file)) {
			// CSS file
			case 'css':
				$type = 'css';
				
				break;
			
			// JS file
			case 'js':
				$type = 'js';
				
				break;
			
			// Audio file
			case 'ogg':
			case 'oga':
				$type = 'snd';
				
				break;
			
			// Image file
			case 'png':
			case 'jpg':
			case 'jpeg':
			case 'gif':
			case 'bmp':
				$type = 'img';
				
				break;
		}
	}
	
	// JS and CSS special stuffs
	if(($type == 'css') || ($type == 'js')) {
		$version = getVersion();
		$hash = genHash($version);
		$cache_hash = md5($path.$hash.jappixLocation());
		
		// Check if the browser supports DEFLATE
		$deflate_support = false;
		
		if(isset($_SERVER['HTTP_ACCEPT_ENCODING']) && substr_count($_SERVER['HTTP_ACCEPT_ENCODING'], 'deflate') && hasGZip() && !$is_developer)
			$deflate_support = true;
		
		// Internationalization
		if($type == 'js') {
			if(isset($_GET['l']) && !empty($_GET['l']) && !preg_match('/\.\.\//', $_GET['l']) && is_dir('../lang/'.$_GET['l']))
				$locale = $_GET['l'];
			else
				$locale = 'en';
		}
		
		else
			$locale = '';
		
		// Define the cache lang name
		if($locale)
			$cache_lang = $cache_hash.'_'.$locale;
		else
			$cache_lang = $cache_hash;
	}
	
	// Explode the file string
	if(strpos($file, '~') != false)
		$array = explode('~', $file);
	else
		$array = array($file);
	
	// Define the reading vars
	$continue = true;
	$loop_files = true;
	
	// Check the cache exists for text files (avoid the heavy file_exists loop!)
	if(!$is_developer && (($type == 'css') || ($type == 'js')) && hasCache($cache_lang))
		$loop_files = false;
	
	// Check if the all the file(s) exist(s)
	if($loop_files) {
		foreach($array as $current) {
			// Stop the loop if a file is missing
			if(!file_exists($dir.$current)) {
				$continue = false;
				
				break;
			}
		}
	}
	
	// We can read the file(s)
	if($continue) {
		// We get the file MIME type
		$mime = strtolower(preg_replace('/(^)(.+)(\.)(.+)($)/i', '$4', $file));
		
		// We set up a known MIME type (and some other headers)
		if(($type == 'css') || ($type == 'js')) {
			// DEFLATE header
			if($deflate_support)
				header('Content-Encoding: deflate');
			
			// MIME header
			if($type == 'css')
				header('Content-Type: text/css; charset=utf-8');
			else if($type == 'js')
				header('Content-Type: application/javascript; charset=utf-8');
		}
		
		else if($mime == 'png')
			header('Content-Type: image/png');
		else if($mime == 'gif')
			header('Content-Type: image/gif');
		else if(($mime == 'jpg') || ($mime == 'jpeg'))
			header('Content-Type: image/jpeg');
		else if($mime == 'bmp')
			header('Content-Type: image/bmp');
		else if(($mime == 'oga') || ($mime == 'ogg'))
			header('Content-Type: audio/ogg');
		
		// Try to catch the file MIME type
		else {
			// Get the MIME
			$finfo = finfo_open(FILEINFO_MIME_TYPE);
			$cmime = finfo_file($finfo, $path);
			finfo_close($finfo);
			
			// Output the MIME
			header('Content-Type: '.$cmime);
		}
		
		// Read the text file(s) (CSS & JS)
		if(($type == 'css') || ($type == 'js')) {
			// If there's a cache file, read it
			if(hasCache($cache_lang) && !$is_developer) {
				$cache_read = readCache($cache_lang);
				
				if($deflate_support)
					echo $cache_read;
				else
					echo gzinflate($cache_read);
			}
			
			// Else, we generate the cache
			else {
				// First try to read the cache reference
				if(hasCache($cache_hash) && !$is_developer)
					$output = gzinflate(readCache($cache_hash));
				
				// No cache reference, we should generate it
				else {
					// Initialize the loop
					$looped = '';
					
					// Add the content of the current file
					foreach($array as $current)
						$looped .= file_get_contents($dir.$current)."\n";
					
					// Filter the CSS
					if($type == 'css') {
						// Apply the CSS background
						$looped = setBackground($looped);
						
						// Set the Get API paths
						$looped = setPath($looped, $hash, HOST_STATIC, $type, '');
					}
					
					// Optimize the code rendering
					if(($type == 'css') && !$is_developer)
						$output = compressCSS($looped);
					
					else if(($type == 'css') && $is_developer)
						$output = $looped;
					
					else if(($type == 'js') && !$is_developer) {
						require_once('./jsmin.php');
						$output = JSMin::minify($looped);
					}
					
					else if(($type == 'js') && $is_developer)
						$output = $looped;
					
					// Generate the reference cache
					$final = gzdeflate($output, 9);
					genCache($final, $is_developer, $cache_hash);
				}
				
				// Filter the JS
				if($type == 'js') {
					// Set the JS locales
					$output = setLocales($output, $locale);
					
					// Set the JS configuration
					$output = setConfiguration($output, $locale, $version);
					
					// Set the Get API paths
					$output = setPath($output, $hash, HOST_STATIC, $type, $locale);
					
					// Translate the JS script
					require_once('./gettext.php');
					includeTranslation($locale, 'main');
					$output = setTranslation($output);
					
					// Generate the cache
					$final = gzdeflate($output, 9);
					genCache($final, $is_developer, $cache_lang);
				}
				
				// Output a well-encoded string
				if($deflate_support)
					echo $final;
				else
					echo gzinflate($final);
			}
		}
		
		// Read the binary file (PNG, OGA and others)
		else {
			ob_clean();
			flush();
			readfile($path);
		}
		
		exit;
	}
	
	// The file was not found
	header('HTTP/1.0 404 Not Found');
	exit('HTTP/1.0 404 Not Found');
}

// The request is not correct
header('HTTP/1.0 400 Bad Request');
exit('HTTP/1.0 400 Bad Request');

?>