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
      socket.emit('error', 'Channel is full');
      return;
    }

    const player = {
      socket: socket,
      num: this.players[0]?.num == "1" ? "2" : "1",
      role:
        this.players[0]?.role == "compiler"
          ? "coder"
          : ("compiler" as "coder" | "compiler"),
    };
    this.players.push(player);
    socket.emit("joined", this.name);
    socket.emit("role", player.role);
    socket.emit("num", player.num);
    socket.join(this.name);
    
    socket.on("disconnect", (reason) => {
      console.log("user disconnected: " + reason);
      this.disconnectPlayer(player);
    });
    
    socket.on("state", () => {
      this.status(player);
    });

    socket.on("line", (line: string) => {
      // Validate line input
      if (typeof line !== 'string') {
        socket.emit('error', 'Line must be a string');
        return;
      }
      
      if (line.length > 1000) {
        socket.emit('error', 'Line too long (max 1000 characters)');
        return;
      }
      
      console.log(line);
      this.codeLines.push(line);
      this.players
        .find((p) => p.socket.id != player.socket.id)
        ?.socket.emit("line", line);
      socket.emit("code", this.codeLines);
    });
    socket.on("ack", () => {
      this.players
        .find((p) => p.socket.id != player.socket.id)
        ?.socket.emit("ack");
    });
    socket.on("line:get", () => {
      const lastLine = this.codeLines.length > 0 ? this.codeLines[this.codeLines.length - 1] : '';
      player.socket.emit("line:get", lastLine);
    });
    socket.on("rematch", () => {
      for (const p of this.players) {
        p.role = p.role == "coder" ? "compiler" : "coder";
      }
      this.codeLines = [];
    });
    socket.on("finish", () => {
      let code = "";
      for (const l of this.codeLines) {
        code += l + "\n";
      }
      let notes = "";
      this.players
        .find((p) => p.socket.id != player.socket.id)
        ?.socket.once("notes:fetch", (arg) => {
          // Validate notes input
          if (typeof arg !== 'string') {
            notes = '';
          } else if (arg.length > 10000) {
            notes = arg.substring(0, 10000); // Truncate if too long
          } else {
            notes = arg;
          }
          
          for (const p of this.players) {
            p.socket.emit("review", { code: code, notes: notes });
          }
        });
      this.players
        .find((p) => p.socket.id != player.socket.id)
        ?.socket.emit("notes:fetch");
    });
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
    console.log(`index ${index} is being spliced out`);
    if (index !== -1) {
      this.players.splice(index, 1);

      player.socket.leave(this.name);
      if (this.players.length === 0) {
        delete channels[this.name];
      }
      player.socket.disconnect(true);
    }
    console.log(`index ${index} was being spliced out: ${this.players}`);
  }
}
interface Player {
  socket: Socket;
  num: string;
  role: "coder" | "compiler";
}
