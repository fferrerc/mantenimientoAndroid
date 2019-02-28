jQuery.sap.declare("sap.rules.ui.parser.resources.common.lib.oDataHandler");sap.rules.ui.parser.resources.common.lib.oDataHandler=sap.rules.ui.parser.resources.common.lib.oDataHandler||{};sap.rules.ui.parser.resources.common.lib.oDataHandler.lib=(function(){var e={};e.PROPERTY_NAME_ID="Id";e.PROPERTY_NAME_NAME="Name";e.PROPERTY_NAME_DESCRIPTION="Description";e.PROPERTY_NAME_REL_VERSION="ExpressionLanguageVersion";e.PROPERTY_NAME_RULE_FORMAT="RuleFormat";e.PROPERTY_NAME_TYPE="Type";e.PROPERTY_NAME_HIT_POLICY="HitPolicy";e.PROPERTY_NAME_DECISION_TABLE="DecisionTable";e.PROPERTY_NAME_RESULT_DO_NAME="ResultDataObjectName";e.PROPERTY_NAME_DT_COLUMNS="DecisionTableColumns";e.PROPERTY_NAME_DDT_ROWS="DecisionTableRows";e.PROPERTY_NAME_CONDITION="Condition";e.PROPERTY_NAME_EXPRESSION="Expression";e.PROPERTY_NAME_FIXED_OPERATOR="FixedOperator";e.PROPERTY_NAME_RESULT="Result";e.PROPERTY_NAME_BUSINESS_DATA_TYPE="BusinessDataType";e.PROPERTY_NAME_VALUE_HELPS="ValueHelps";e.PROPERTY_NAME_VALUE_HELP_ID="ValueHelpId";e.PROPERTY_NAME_SERVICE_URL="ServiceUrl";e.PROPERTY_NAME_PROPERTY_PATH="PropertyPath";e.PROPERTY_NAME_TYPE="Type";e.PROPERTY_NAME_SIZE="Size";e.PROPERTY_NAME_DATA_TYPE="DataType";e.PROPERTY_NAME_SIZE="Size";e.PROPERTY_NAME_DO_ATTRIBUTE_NAME="DataObjectAttributeName";e.PROPERTY_NAME_MAPPING_INFO="MappingInfo";e.PROPERTY_NAME_TARGET_DATA_OBJECT_ID="TargetDataObjectId";e.PROPERTY_NAME_ATTRIBUTE_MAPPINGS="AttributeMappings";e.PROPERTY_NAME_ATTRIBUTE_MAPPINGS_SOURCE="Source";e.PROPERTY_NAME_ATTRIBUTE_MAPPINGS_TARGET="Target";e.PROPERTY_NAME_SCHEMA="Schema";e.PROPERTY_NAME_PARAMETERS="Parameters";e.PROPERTY_NAME_COLUMN_ID="ColId";e.PROPERTY_NAME_CONTENT="Content";e.PROPERTY_NAME_CELLS="Cells";e.PROPERTY_NAME_DATA_OBJECTS="DataObjects";e.PROPERTY_NAME_DATA_OBJECT="DataObject";e.PROPERTY_NAME_VOCABULARY_RULES="Rules";e.PROPERTY_NAME_VOCABULARY_RULE="Rule";e.PROPERTY_NAME_RESULTDOID="resultDataObjectId";e.PROPERTY_NAME_USAGE="Usage";e.PROPERTY_NAME_CARDINALITY="Cardinality";e.PROPERTY_NAME_ATTRIBUTES="Attributes";e.PROPERTY_NAME_ATTRIBUTE="Attribute";e.PROPERTY_NAME_ASSOCIATIONS="Associations";e.PROPERTY_NAME_ASSOCIATION="Association";e.TYPE_CONDITION="CONDITION";e.TYPE_RESULT="RESULT";e.TYPE_DO="DBCTX";e.TYPE_NONE="NONE";e.SOURCE_TYPE_DATA="Data";e.CP_VALUE_SOURCE="ValueSources";e.CP_VALUE_ENUM="Enumerations";e.CP_VOCABULARY_ID="VocabularyId";e.CP_DATOBJECT_ID="DataObjectId";e.CP_ATTRIBUTE_ID="AttributeId";e.CP_VALUE_SOURCE_TYPE="SourceType";e.CP_VALUE_SOURCE_TYPE_STATIC="U";e.CP_VALUE_SOURCE_TYPE_SERVICE="O";e.CP_HAS_VALUE_SOURCE="HasValueSource";var r={"BASIC":"basic","ADVANCED":"advanced"};var a={"DT":"decisionTable"};var h={"FM":"firstMatch","AM":"allMatch"};var c={"1..1":"OneToOne","1..n":"OneToMany","1-0..1":"OneToZeroOrOne","n..1":"ManyToOne"};var v={};v[e.PROPERTY_NAME_RULE_FORMAT]=r;v[e.PROPERTY_NAME_TYPE]=a;v[e.PROPERTY_NAME_HIT_POLICY]=h;v[e.PROPERTY_NAME_CARDINALITY]=c;function g(o,p){var f;var i;var j=null;f=p[0].toLowerCase()+p.substring(1);i=p[0].toUpperCase()+p.substring(1);if(o.hasOwnProperty(f)){j=f;}else if(o.hasOwnProperty(i)){j=i;}return j;}function b(o,p){return o[g(o,p)];}function d(o,p){if(!v[p]){return null;}var f=g(o,p);var D=o[f];return v[p][D];}e.getEnumPropertyValue=d;e.getOdataPropName=g;e.getOdataPropertyValue=b;return e;}());
