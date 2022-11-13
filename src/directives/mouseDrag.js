export default function (app) {
  app.directive("drag", {
    mounted(node, binding) {
      let handler = binding.value;
      let baseX;
      let baseY;
      let isDown = false;

      node.addEventListener("mousedown", (e) => {
        let classAttr = e.target.attributes.class;
        // 不是小球或者头部不移动
        if (
          !classAttr ||
          (classAttr.nodeValue !== "header" && classAttr.nodeValue !== "ball")
        ) {
          return;
        }

        isDown = true;
        baseX = e.offsetX;
        baseY = e.offsetY;
      });

      document.addEventListener("mousemove", (e) => {
        const x = Math.round(e.screenX - baseX);
        const y = Math.round(e.screenY - baseY);
        isDown && handler({ x, y });
      });

      // 解绑
      document.addEventListener("mouseup", () => {
        isDown = false;
      });
    },
  });
}
