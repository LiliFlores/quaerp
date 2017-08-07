<?php

    class ContentConverter {

        function __construct() {}

        function convertArray($array_to_convert, $content_type = "") {

            $converted_array;
            switch ($content_type) {
                case 'json':
                    $converted_array = json_encode($array_to_convert);
                    break;
                case 'xml':
                    // TODO
                    // $xml = new SimpleXMLElement('<rootTag/>');
                    // $this->to_xml($xml, $array_to_convert);
                    //
                    // print $xml->asXML();
                    // die();
                    break;
                default:
                    $converted_array = json_encode($array_to_convert);
                    break;
            }

            return $converted_array;
        }

        function to_xml(SimpleXMLElement $object, array $data) {
            foreach ($data as $key => $value) {
                if (is_array($value)) {
                    $new_object = $object->addChild($key);
                    $this->to_xml($new_object, $value);
                } else {
                    $object->addChild($key, $value);
                }
            }
        }

    }

?>
