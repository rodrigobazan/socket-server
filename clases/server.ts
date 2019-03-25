import express from 'express';
import { SERVER_PORT } from '../global/enviroment';
import sokectIO from 'socket.io';
import http from 'http';
import * as socket from '../sockets/socket';

export default class Server{

    private static _instance: Server;

    public app: express.Application;
    public port: number;
 
    public io: SocketIO.Server;
    private httpServer: http.Server;

    private constructor(){
        this.app = express();
        this.port = SERVER_PORT;
        this.httpServer = new http.Server(this.app);
        this.io = sokectIO(this.httpServer);
        this.escucharSockets();
    }

    public static get instance(){
        return this._instance || (this._instance = new this());
    }

    private escucharSockets(){
        console.log('Escuchando conexion - sockets');
        this.io.on('connection', cliente => {

            // Conectar Cliente
            socket.conectarCliente(cliente);
            
            // Configurar usuario
            socket.configurarUsuario(cliente, this.io);

            // Obtener usuarios activos
            socket.obtenerUsuarios(cliente, this.io);

            // Mensajes
            socket.mensaje(cliente, this.io);

            // Desconectar
            socket.desconectar(cliente, this.io);            
            
        });
    }

    start(callback: Function){
        this.httpServer.listen(this.port);
    }
}