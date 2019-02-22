c) serialisierung des node-diagrams erfolgt so, dass in die cfg des Interpreters ein KV-Paar kommt, dessen Type UserDefDict.intrptrtType ist, value ist dann ein String mit dem Interpreternamen oder eine andere Interpreter-cfg als json, deren Funktionen werden entweder interpretiert oder rausgeworfen (erst mal rausgeworfen, der Name sollte hoffentlich zu einem auffindbaren Interpreter führen, solange es nur einen Matcher gibt). Dort können dann auch sub-Interpreter drin sein. Nennen wir das Prinzip Link or include?? Jedenfalls hab ich dann das Problem mit dem Baum vs. Graph von json nicht mehr, und ggf. einfache JSON-LD-Umformung
d) wenn values von einem Interpreter generiert werden, dann werden die im ExplorerStore gespeichert, indem sie einen Hashwert zugewiesen bekommen, damit beim Neubau eines Interpreters der richtige Wert zugewiesen wird

#Cleanup
- PureAppInterpreterEditor State handling

#UX
- it shouldn't be possible to connect ports with non-matching kvStore.ldType
- highlight matching kvStore.ldType or undefined input type

#Node-serialization:
done - flatten KvStores into BPCfg						!!!
done - External Input Markers to main BPCfg   !!
done - redux-connection soll erst in einem speziellen Interpreter connected werden, um sie davor beliebig extenden zu können
done - Nächstes Todo ist in editor-logic.addBlueprintToRetriever() anzusetzen, eine Interpreter-Container-Klasse zu bauen, die dann von dem GenericContainer gelesen werden kann, das ist InterpreterReferenceMapType-component
done - Interpreter-ReferenceMapType.cfg lesen, daraus in componentWillMount() das Setup bauen, in componentWillReceiveProps() die entsprechenden Werte zuweisen 
done - Im ImgHeadSubDescr-Component die cfg lesen und daraus eine Sub-Komponente erstellen und befüllen.
done - Im InterpreterRefMap-Component die ILDOptions-Objekte erstellen und ggf füllen
- handle circular references
- instead of ldOptionsMap-Entries being created in genericContainer by displayedType, they should only create entries when there's no matching ldTokenString. PortselectorWidget should create and modify entry. GenericContainer can only hold LDOptions, i.e. "instances" vs "classes"

- server-side: upsert instead of insert

last serialized bits & pieces: seems to work!
{
  "forType": "78e74a11-229b-4bdd-99ff-3f324b7920ca",
  "nameSelf": "nameee",
  "initialKvStores": [
    {
      "key": "InterpreterReferenceMapKey",
      "value": {
        "78e74a11-229b-4bdd-99ff-3f324b7920ca": {
          "forType": "shnyder/ImgHeadSubDescIntrprtr",
          "nameSelf": "78e74a11-229b-4bdd-99ff-3f324b7920ca",
          "initialKvStores": [
            {
              "key": "primaryInterpreter",
              "value": {
                "objRef": "50de35ae-191b-4fb4-a830-1f86855ccd7d",
                "propRef": "exportSelf"
              },
              "ldType": "InterpreterType"
            },
            {
              "key": "HeaderText",
              "value": {
                "objRef": "db879383-4a43-4c5d-aead-5e2844c5ab63",
                "propRef": "http://schema.org/name"
              },
              "ldType": "http://schema.org/Text"
            },
            {
              "key": "SubHeaderText",
              "ldType": "http://schema.org/Text"
            },
            {
              "key": "Description",
              "value": {
                "objRef": "db879383-4a43-4c5d-aead-5e2844c5ab63",
                "propRef": "http://schema.org/description"
              },
              "ldType": "http://schema.org/Text"
            }
          ],
          "crudSkills": "cRud",
          "interpretableKeys": []
        },
        "50de35ae-191b-4fb4-a830-1f86855ccd7d": {
          "forType": "http://schema.org/ViewAction",
          "nameSelf": "50de35ae-191b-4fb4-a830-1f86855ccd7d",
          "initialKvStores": [
            {
              "key": "http://schema.org/name",
              "value": {
                "objRef": "b8db4aae-e272-4a76-bc32-edfc210d97fe",
                "propRef": "http://schema.org/name"
              }
            },
            {
              "key": "http://schema.org/fileFormat",
              "value": {
                "objRef": "b8db4aae-e272-4a76-bc32-edfc210d97fe",
                "propRef": "http://schema.org/fileFormat"
              }
            },
            {
              "key": "http://schema.org/contentUrl",
              "value": {
                "objRef": "b8db4aae-e272-4a76-bc32-edfc210d97fe",
                "propRef": "http://schema.org/contentUrl"
              }
            }
          ],
          "crudSkills": "cRud",
          "interpretableKeys": []
        },
        "b8db4aae-e272-4a76-bc32-edfc210d97fe": {
          "forType": "shnyder/imageRetriever",
          "nameSelf": "b8db4aae-e272-4a76-bc32-edfc210d97fe",
          "initialKvStores": [
            {
              "key": "srvURL",
              "value": "http://image",
              "ldType": "http://schema.org/Text"
            },
            {
              "key": "identifier",
              "value": {
                "objRef": "db879383-4a43-4c5d-aead-5e2844c5ab63",
                "propRef": "http://schema.org/image"
              },
              "ldType": "http://schema.org/Text"
            }
          ],
          "crudSkills": "cRud",
          "interpretableKeys": []
        },
        "db879383-4a43-4c5d-aead-5e2844c5ab63": {
          "forType": "shnyder/productRetriever",
          "nameSelf": "db879383-4a43-4c5d-aead-5e2844c5ab63",
          "initialKvStores": [
            {
              "key": "srvURL",
              "value": "http://prod",
              "ldType": "http://schema.org/Text"
            },
            {
              "key": "identifier",
              "ldType": "http://schema.org/Text"
            }
          ],
          "crudSkills": "cRud",
          "interpretableKeys": [
            "identifier"
          ]
        }
      },
      "ldType": "InterpreterReferenceMapType"
    }
  ],
  "crudSkills": "cRud",
  "interpretableKeys": []
}