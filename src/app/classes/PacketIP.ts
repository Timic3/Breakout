export class PacketIP {
  public sourceX;
  public sourceY;
  public sourceIP;

  public hasDestination = false;
  public destinationX;
  public destinationY;
  public destinationIP;

  public returned = false;
  public returnX;
  public returnY;

  public uiAlpha = 1.0;

  constructor(sourceX: number, sourceY: number) {
    this.sourceX = sourceX;
    this.sourceY = sourceY;
    this.sourceIP = '192.168.1.10';
  }
}
