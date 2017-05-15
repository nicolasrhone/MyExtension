<?php

/**
 * Rubedo -- ECM solution
 * Copyright (c) 2014, WebTales (http://www.webtales.fr/).
 * All rights reserved.
 * licensing@webtales.fr
 *
 * Open Source License
 * ------------------------------------------------------------------------------------------
 * Rubedo is licensed under the terms of the Open Source GPL 3.0 license.
 *
 * @category   Rubedo
 * @package    Rubedo
 * @copyright  Copyright (c) 2012-2014 WebTales (http://www.webtales.fr)
 * @license    http://www.gnu.org/licenses/gpl.html Open Source GPL 3.0 license
 */
namespace Rubedo\Security;

/**
 * Service to handle allowed and disallowed HTML contents
 *
 *
 * @author jbourdin
 * @category Rubedo
 * @package Rubedo
 */
class CcnHtmlPurifier extends HtmlCleaner
{

    protected static $_purifier;

    /**
     * Clean a raw content to become a valid HTML content without threats
     *
     * @param string $html
     * @return string
     */
    protected function internalClean($html)
    {
        if (empty($html)) {
            return $html;
        }

        if (!class_exists('\HTMLPurifier_Config')) {
            return parent::internalClean($html);
        }
        if (!isset(self::$_purifier)) {
            $config = \HTMLPurifier_Config::createDefault();
            $config->set('Core.Encoding', 'UTF-8');
            $config->set('Cache.SerializerPath', APPLICATION_PATH . "/cache/htmlpurifier");
            $config->set('Attr.AllowedFrameTargets', array(
                "_blank",
                "_self",
                "_parent",
                "_top"
            ));
	    $config->set('HTML.EnableAttrID',true);
            $config->set('HTML.Attr.Name.UseCDATA', true);
            $config->set('HTML.SafeIframe', true);
		$config->set('URI.SafeIframeRegexp', '%^(https?:)?//(www\.youtube(?:-nocookie)?\.com/embed/|player\.vimeo\.com/video/)%'); //allow YouTube and Vimeo
            $def = $config->getHTMLDefinition(true);
            $def->addAttribute('a', 'rubedo-page-link', 'CDATA');
            $def->addAttribute('a', 'rubedo-event', 'CDATA');
												$def->addAttribute('iframe', 'allowfullscreen', 'Bool');
            $def->addAttribute('a', 'onclick', 'CDATA');
		$def->addAttribute('a', 'data-dismiss', 'CDATA');
		$def->addAttribute('button', 'onclick', 'CDATA');
            $def->addAttribute('button', 'rubedo-event', 'CDATA');
	    $def->addAttribute('a', 'data-toggle', 'Text');
	    $def->addAttribute('a', 'data-target', 'Text');
            self::$_purifier = new \HTMLPurifier($config);
        }
        $html = self::$_purifier->purify($html);

        return $html;
    }
}
