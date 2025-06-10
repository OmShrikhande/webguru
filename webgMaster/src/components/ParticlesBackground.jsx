draw(ctx) {
  // Prevent negative or zero radius
  if (this.radius <= 0) return;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
  ctx.fillStyle = this.color;
  ctx.fill();
  ctx.closePath();
}