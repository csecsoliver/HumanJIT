import { Socket } from "socket.io";

export const channels: { [key: string]: Channel } = {};
export class Channel {
  name: string;
  players: Player[] = [];
  codeLines: string[] = [];
  constructor(name: string) {
    this.name = name;
    channels[name] = this;
  }
  addPlayer(socket: Socket) {
    if (this.players.length >= 2) {
      throw new Error("Channel is full");
    }

    const player = {
      socket: socket,
      num: this.players[0]?.num == "1"? "2": "1",
      role:
        this.players[0]?.role == "compiler"
          ? "coder"
          : "compiler" as "coder" | "compiler",
    };
    this.players.push(player);
    socket.emit("joined", this.name);
    socket.emit("role", player.role);
    socket.emit("num", player.num);
    socket.join(this.name);
    socket.on("disconnect", (reason) => {
      console.log("user disconnected: "+ reason);
      this.disconnectPlayer(player);
    });
    socket.on("state", () => {
      this.status(player);
    });

    socket.on("line", (line: string) => {
      console.log(line);
      this.codeLines.push(line);
      for (const p of this.players) {
        if (p.socket.id !== socket.id) {
          p.socket.emit("line", line);
        }
      }
      socket.emit("code", this.codeLines);
    });
    socket.on("ack", () => {
      for (const p of this.players) {
        if (p.socket.id !== socket.id) {
          p.socket.emit("ack");
        }
      }
    });
    socket.on("line:get", ()=>{
      player.socket.emit("line:get", this.codeLines[-1]);
    })
    
  }

  status(player: Player) {
    
    player.socket.emit("state", {
      num: player.num,
      role: player.role,
      players: this.players.length,
      
    });
  }
  disconnectPlayer(player: Player) {
    const index = this.players.findIndex(
      (p) => p.socket.id === player.socket.id
    );
    console.log(`index ${index} is being spliced out`)
    if (index !== -1) {
      this.players.splice(index, 1);

      player.socket.leave(this.name);
      if (this.players.length === 0) {
        delete channels[this.name];
      }
      player.socket.disconnect(true);
    }
    console.log(`index ${index} was being spliced out: ${this.players}`)
  }
}
interface Player {
  socket: Socket;
  num: string;
  role: "coder" | "compiler";
}
