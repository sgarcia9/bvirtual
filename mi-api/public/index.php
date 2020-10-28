<?php
declare(strict_types=1);

use App\Application\Handlers\HttpErrorHandler;
use App\Application\Handlers\ShutdownHandler;
use App\Application\ResponseEmitter\ResponseEmitter;
use DI\ContainerBuilder;
use Slim\Factory\AppFactory;
use Slim\Factory\ServerRequestCreatorFactory;

require __DIR__ . '/../vendor/autoload.php';

// Instantiate PHP-DI ContainerBuilder
$containerBuilder = new ContainerBuilder();

if (false) { // Should be set to true in production
	$containerBuilder->enableCompilation(__DIR__ . '/../var/cache');
}

// Set up settings
$settings = require __DIR__ . '/../app/settings.php';
$settings($containerBuilder);

// Set up dependencies
$dependencies = require __DIR__ . '/../app/dependencies.php';
$dependencies($containerBuilder);

// Set up repositories
$repositories = require __DIR__ . '/../app/repositories.php';
$repositories($containerBuilder);

// Build PHP-DI Container instance
$container = $containerBuilder->build();

// Instantiate the app
AppFactory::setContainer($container);
$app = AppFactory::create();
$callableResolver = $app->getCallableResolver();

// Register middleware
$middleware = require __DIR__ . '/../app/middleware.php';
$middleware($app);

// Register routes
$routes = require __DIR__ . '/../app/routes.php';
$routes($app);

/** @var bool $displayErrorDetails */
$displayErrorDetails = $container->get('settings')['displayErrorDetails'];

// Create Request object from globals
$serverRequestCreator = ServerRequestCreatorFactory::create();
$request = $serverRequestCreator->createServerRequestFromGlobals();

// Create Error Handler
$responseFactory = $app->getResponseFactory();
$errorHandler = new HttpErrorHandler($callableResolver, $responseFactory);

// Create Shutdown Handler
$shutdownHandler = new ShutdownHandler($request, $errorHandler, $displayErrorDetails);
register_shutdown_function($shutdownHandler);

// Add Routing Middleware
$app->addRoutingMiddleware();

// Add Error Middleware
$errorMiddleware = $app->addErrorMiddleware($displayErrorDetails, false, false);
$errorMiddleware->setDefaultErrorHandler($errorHandler);

// Run App & Emit Response
$response = $app->handle($request);
$responseEmitter = new ResponseEmitter();
$responseEmitter->emit($response);


function getConnection() {
    $dbhost="127.0.0.1";
    $dbuser="root";
    $dbpass="";
    $dbname="db_bvirtual";
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}

function obtenerEmpleados($response) {
    $sql = "SELECT * FROM ps_form";
    try {
        $stmt = getConnection()->query($sql);
        $employees = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        return json_encode($employees);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function checkEmail($email) {
    $sql = "SELECT * FROM ps_form WHERE email = '" . $email . "'";
    try {
        $stmt = getConnection()->query($sql);
        $forms = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        return $forms;

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function agregarEmpleado($request) {
    $nombre = $_POST["nombre"];
    $apellidos = $_POST["apellidos"];
    $email = $_POST["email"];
    $dni = $_POST["dni"];
    $movil = $_POST["movil"];
    $checkEmail = checkEmail($email);
    if (!empty($checkEmail)) {
        $datos = array('status' => 'error', 'data' => 'Ya existe el usuario con email '. $email);
        die(var_dump($datos));
        //return $request->withJson($datos, 200);
    }
    
    $sql = "INSERT INTO ps_form (nombre, apellidos, email, dni, movil) VALUES (:nombre, :apellidos, :email, :dni, :movil)";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("nombre", $nombre);
        $stmt->bindParam("apellidos", $apellidos);
        $stmt->bindParam("email", $email);
        $stmt->bindParam("dni", $dni);
        $stmt->bindParam("movil", $movil);
        $stmt->execute();
        $datos = array('status' => 'ok', 'data' => 'Usuario creado correctamente');
        die(var_dump($datos));
    } catch(PDOException $e) {
        $datos = array('status' => 'error', 'data' => $e->getMessage());
        die(var_dump($datos));
    }
}
