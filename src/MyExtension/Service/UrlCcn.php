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

namespace RubedoAPI\Services\Router;

use Rubedo\Services\Manager;
use RubedoAPI\Exceptions\APIServiceException;


/**
 * Class Url
 * @package RubedoAPI\Services\Router
 */
class Url extends \Rubedo\Router\Url
{
    
    /**
     * return URL from API
     *
     * @param $content
     * @param string $type
     * @param $site
     * @param $page
     * @param $locale
     * @param null $defaultPage
     * @return string
     * @throws \RubedoAPI\Exceptions\APIServiceException
     * @todo Fix taxonomy for the search block (line 55 to 65) because we make 1 request by content
     */
    public function displayUrlApi($content, $type = "default", $site, $page, $locale, $defaultPage = null)
    {
        $pageValid = false;
        $doNotAddSite = true;
        
        if ($defaultPage && $type == "default") {
            $pageId = $defaultPage;
            $pageValid = true;
        }
        
        if (isset($content['taxonomy.navigation']) && $content['taxonomy.navigation'] !== "" && !$pageValid) {
            $dbContent = Manager::getService("Contents")->findById($content["id"], true, false);
            if (isset($dbContent["taxonomy"]["navigation"])) {
                if (isset($content["taxonomy"]["navigation"])) {
                    array_merge($content["taxonomy"]["navigation"], $dbContent["taxonomy"]["navigation"]);
                } else {
                    $content["taxonomy"]["navigation"] = $dbContent["taxonomy"]["navigation"];
                }
            }
        }
        if (isset($content['taxonomy']['navigation']) && $content['taxonomy']['navigation'] !== "" && !$pageValid) {
            if (!is_array($content['taxonomy']['navigation'])){
                $content['taxonomy']['navigation']=array($content['taxonomy']['navigation']);
            }
            foreach ($content['taxonomy']['navigation'] as $pageId) {
                if ($pageId == 'all') {
                    continue;
                }
                $page = Manager::getService('Pages')->findById($pageId);
                if ($page && $page['site'] == $site['id']) {
                    $pageValid = true;
                    break;
                }
                
            }
        }
        if (!$pageValid) {
            // la page indiquée n'est pas sur le site !
            if ($type == "default") {
                $pageId = $page['id']; //==> c'est la dernière page de la taxo de navigation
                if (isset($page['maskId'])) {
                    $mask = Manager::getService('Masks')->findById($page['maskId']);
                    if (!isset($mask['mainColumnId']) || empty($mask['mainColumnId'])) {
                        $pageId = $this->_getDefaultSingleBySiteID($site['id']);
                    }
                    
                }
                //récupérer le site
                $doNotAddSite = false;
            } elseif ($type == "canonical") {
                $pageId = $this->_getDefaultSingleBySiteID($site['id']);
            } else {
                throw new APIServiceException("You must specify a good type of URL : default or canonical", 500);
            }
        }
        if ($pageId) {
            $data = array(
                'pageId' => $pageId,
                'content-id' => $content['id'],
                'locale' => $locale
            );
            if ($type == "default") {
                $pageUrl = $this->url($data, 'rewrite', true);
            } elseif ($type == "canonical") {
                // @todo refactor this
                $pageUrl = $this->url($data, 'rewrite', true);
            } else {
                throw new APIServiceException("You must specify a good type of URL : default or canonical", 500);
            }
            if ($doNotAddSite) {
                return str_replace("//","/",$pageUrl);
            } else {
                $siteOfContent =  Manager::getService('Sites')->getHost($page['site']);
                var_dump($_SERVER);
                return 'https://' . $siteOfContent . str_replace("//","/",$pageUrl);
            }
        } else {
            return '#';
        }
    }
}
