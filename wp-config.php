<?php


// ** MySQL settings ** //
/** The name of the database for WordPress */
define('DB_NAME', 'local-stephenfrister');

/** MySQL database username */
define('DB_USER', 'wp');

/** MySQL database password */
define('DB_PASSWORD', 'wp');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

define('AUTH_KEY',         '<IHvaP~v-k1>1KIz_#ia9PMfLV|Bf;Hn^!y|wZ{!QBq8}8%OCYCC2$ds!l_ENQNl');
define('SECURE_AUTH_KEY',  ',U$6A@fT$F$_$am2{iGxwC&2L]5;5o~Kh{g/,=sKzbD+sODrb*YbyE0y@Nd}UF#_');
define('LOGGED_IN_KEY',    ';&<.mS~|iC8T8[p-,:6P^zBY2*vVf--,U|bSv[PARoKvm`>~a^D|S7qODd73M/y1');
define('NONCE_KEY',        'TE}|tc+b~+7<T%i$MNjGs|r|!}rtxqcbX%K;CZw9NFc,+x@:R-@6)!}Hx1Xqs*UA');
define('AUTH_SALT',        'u}D^TP|uQ~WB]q+:h#+sUGri1+,/*Haqs8|0i` ^d|O2@^Umgqm>w5u}5S=E|NK?');
define('SECURE_AUTH_SALT', 'HlanP]{}XaTe:us$B?dl7!,+4JOH#)^/tbaF)fX9$,#>pVV OpC++Th>{S7V%Yb/');
define('LOGGED_IN_SALT',   'ZqmL?QSL4e[T~Cbq|F.+TRgz?u:{D&*V|Y?]|QKZErMAo-nEa;Avf%F<tn~G`v,{');
define('NONCE_SALT',       '|lfXs&o=7F2n%|(s4_|(|LZQQ!.M(<.#H|3K>IY9-1A@<a>KhQLbs8r9V1Vx-.FJ');


$table_prefix = 'wp_';





/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
