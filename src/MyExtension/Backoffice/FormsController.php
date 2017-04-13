<?php
/**
 * Rubedo -- ECM solution
 * Copyright (c) 2013, WebTales (http://www.webtales.fr/).
 * All rights reserved.
 * licensing@webtales.fr
 *
 * Open Source License
 * ------------------------------------------------------------------------------------------
 * Rubedo is licensed under the terms of the Open Source GPL 3.0 license. 
 *
 * @category   Rubedo
 * @package    Rubedo
 * @copyright  Copyright (c) 2012-2013 WebTales (http://www.webtales.fr)
 * @license    http://www.gnu.org/licenses/gpl.html Open Source GPL 3.0 license
 */
namespace MyExtension\Backoffice\Controller;

use Rubedo\Services\Manager;
use Rubedo\Backoffice\Controller\DataAccessController;  
use Zend\View\Model\JsonModel;

/**
 * Controller providing CRUD API for the Forms JSON
 *
 * Receveive Ajax Calls for read & write from the UI to the Mongo DB
 *
 *
 * @author jbourdin
 * @category Rubedo
 * @package Rubedo
 *         
 */
class FormsController extends DataAccessController
{

    public function __construct ()
    {
        parent::__construct();
        
        // init the data access service
        $this->_dataService = Manager::getService('Forms');
    }

    public function getStatsAction ()
    {
        $formId = $this->params()->fromPost('form-id');
        if (! $formId) {
            throw new \Rubedo\Exceptions\User('This action needs a form id as argument.', "Exception11");
        }
        $statsResponse = array();
        $statsResponse['validResults'] = Manager::getService('FormsResponses')->countValidResponsesByFormId($formId);
        $statsResponse['invalidResults'] = Manager::getService('FormsResponses')->countInvalidResponsesByFormId($formId);
        $statsResponse['totalResults'] = $statsResponse['invalidResults'] + $statsResponse['validResults'];
        $response = array();
        $response['data'] = $statsResponse;
        $response['success'] = true;
        return new JsonModel($response);
    }

    /**
     * @todo convert to ZF2
     * @throws \Rubedo\Exceptions\User
     */
    public function getCsvAction ()
    {
        $formId = $this->params()->fromQuery('form-id');
        if (! $formId) {
            throw new \Rubedo\Exceptions\User('This action needs a form id as argument.', "Exception11");
        }
        
        $form = Manager::getService('Forms')->findById($formId);
        
        $displayQnb = $this->params()->fromPost('display-qnb', false);
        $fileTitle = "export";
        
        $fileName = $fileTitle . '_' . $formId . '_' . date('Ymd') . '.csv';
        $filePath = sys_get_temp_dir() . '/' . $fileName;
        $csvResource = fopen($filePath, 'w+');
        
        $fieldsArray = array();
        
        $headerArray = array(
            'Date',
            'Terminé'
        );
        $definiedAnswersArray = array();
        
        foreach ($form['formPages'] as $page) {
            foreach ($page['elements'] as $element) {
                switch ($element['itemConfig']['fType']) {
                    case 'multiChoiceQuestion':
                       if ($element['itemConfig']['fieldType'] == 'checkboxgroup') {
                            $tempSubField = array();
                            foreach ($element['itemConfig']['fieldConfig']['items'] as $item) {
                                $headerArray[] = $element['itemConfig']["qNb"]. ' - ' . $item['boxLabel'];
                                $tempSubField[] = $item['inputValue'];
                                $definiedAnswersArray[$item['inputValue']] = $item['boxLabel'];
                            }
                            $fieldsArray[] = array(
                                'type' => 'qcm',
                                'value' => array(
                                    'id' => $element['id'],
                                    'items' => $tempSubField
                                )
                            );
                            break;
                        
                        }else {
                            foreach ($element['itemConfig']['fieldConfig']['items'] as $item) {
                                $headerArray[] = $element['itemConfig']["qNb"]. ' - ' . $item['boxLabel'];
                                $tempSubField[] = $item['inputValue'];
                                $definiedAnswersArray[$item['inputValue']] = $item['boxLabel'];
                            }
                            $fieldsArray[] = array(
                                'type' => 'simple',
                                'value' => array(
                                    'id' => $element['id'],
                                    'items' => $tempSubField
                                )
                            );
                            foreach ($element['itemConfig']['fieldConfig']['items'] as $item) {
                                $definiedAnswersArray[$item['inputValue']] = $item['boxLabel'];
                            }
                            break;
                        }
                    case 'openQuestion':
                        $headerArray[] = $element['itemConfig']["qNb"];
                        $fieldsArray[] = array(
                            'type' => 'open',
                            'value' => $element['id']
                        );
                        break;
                    case 'predefinedPrefsQuestion' :
                            for ($i = 1; $i <= $element['itemConfig']['numberOfQuestions']; $i++) {
                                $headerArray[]=$element['itemConfig']["qNb"]." - question ".$i." - ligne du plan d'expérience";
                                $fieldsArray[] = array(
                                    'type' => 'add1',
                                    'value' => $element['id']."question".$i."expPlanRow"
                                );
                                for ($j = 1; $j <= $element['itemConfig']['numberOfChoices']; $j++) {
                                    $headerArray[]=$element['itemConfig']["qNb"]." - question ".$i." - choix ".$j;
                                    $fieldsArray[] = array(
                                        'type' => 'open',
                                        'value' => $element['id']."question".$i."choice".$j
                                    );
                                }
                            }
                         break;
                    default:
                        break;
                }
            }
        }
        
        $list = Manager::getService('FormsResponses')->getResponsesByFormId($formId);
        var_dump($list);
        fputcsv($csvResource, $headerArray, ';');
        
        foreach ($list['data'] as $response) {
            $csvLine = array(
                Manager::getService('Date')->getDefaultDatetime($response['lastUpdateTime']),
                $response['status'] == 'finished' ? 'oui' : 'non'
            );
            foreach ($fieldsArray as $element) {
                switch ($element['type']) {
                    case 'open':
                        $csvLine[] = isset($response['data'][$element['value']]) ? $response['data'][$element['value']] : null;
                        break;
                    case 'add1':
                        $csvLine[] = isset($response['data'][$element['value']]) ? $response['data'][$element['value']]+1 : null;
                        break;
                    case 'simple':
                        foreach ($element['value']['items'] as $item) {
                            $csvLine[] = ($item ==$response['data'][$element['value']]);
                            /*if (isset($response['data'][$element['value']['id']])) {
                                $csvLine[] = in_array($item, $response['data'][$element['value']['id']]);
                            } else {
                                $csvLine[] = null;
                            }*/
                        }
                        /*
                        if (isset($response['data'][$element['value']]) && is_array($response['data'][$element['value']])) {
                            $result = array_pop($response['data'][$element['value']]);
                            $csvLine[] = $definiedAnswersArray[$result];
                        } else {
                            $csvLine[] = $response['data'][$element['value']];
                        }*/
                        
                        break;
                    case 'qcm':
                        foreach ($element['value']['items'] as $item) {
                            if (isset($response['data'][$element['value']['id']])) {
                                $csvLine[] = in_array($item, $response['data'][$element['value']['id']]);
                            } else {
                                $csvLine[] = null;
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
            
            fputcsv($csvResource, $csvLine, ';');
        }
        $content = file_get_contents($filePath);
        $response = $this->getResponse();
        $headers = $response->getHeaders();
        $headers->addHeaderLine('Content-Type', 'text/csv');
        $headers->addHeaderLine('Content-Disposition', "attachment; filename=\"$fileName\"");
        $headers->addHeaderLine('Accept-Ranges', 'bytes');
        $headers->addHeaderLine('Content-Length', strlen($content));
        
        $response->setContent(utf8_decode($content));
        return $response;
    }
}