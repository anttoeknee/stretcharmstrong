<?php
/**
 * Part of the Fuel framework.
 *
 * @package    Fuel
 * @version    1.0
 * @author     Fuel Development Team
 * @license    MIT License
 * @copyright  2010 - 2012 Fuel Development Team
 * @link       http://fuelphp.com
 */

/**
 * NOTICE:
 *
 * If you need to make modifications to the default configuration, copy
 * this file to your app/config folder, and make them in there.
 *
 * This will allow you to upgrade fuel without losing your custom config.
 */


return array(
	'prep_value'            => true,
	'auto_id'               => true,
	'auto_id_prefix'        => 'frm-',
	'form_method'           => 'post',
	'form_template'         => "\n\t\t{open}\n\t\t<div>\n{fields}\n\t\t</div>\n\t\t{close}\n",
	'fieldset_template'     => "\n\t\t<dl>{open}<dd>\n{fields}</dd></dl>\n\t\t{close}\n",
	'field_template'        => "\t\t<dl>\n\t\t\t<dt class=\"{error_class}\">{label}{required}</dt>\n\t\t\t<dd class=\"{error_class}\">{field} <span>{description}</span> {error_msg}</dd>\n\t\t</dl>\n",
	'multi_field_template'  => "\t\t<dl>\n\t\t\t<dt class=\"{error_class}\">{group_label}{required}</dt>\n\t\t\t<dd class=\"{error_class}\">{fields}\n\t\t\t\t{field} {label}<br />\n{fields}<span>{description}</span>\t\t\t{error_msg}\n\t\t\t</dd>\n\t\t</dl>\n",
	'error_template'        => '<span>{error_msg}</span>',
	'required_mark'         => '*',
	'inline_errors'         => false,
	'error_class'           => 'validation_error',
);
