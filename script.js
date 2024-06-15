const aboutContainer = document.querySelector("div#about");
const root = document.querySelector(':root');

aboutContainer.addEventListener("mousemove", (event) => {
    root.style.setProperty('--Xpx-gradient', `${event.layerX}px`);
    root.style.setProperty('--Ypx-gradient', `${event.layerY}px`);
});
aboutContainer.addEventListener("mouseleave", () => {
    setTimeout(() => {
        root.style.setProperty('--Xpx-gradient', `${-2220}px`);
        root.style.setProperty('--Ypx-gradient', `${-2220}px`);
    }, 50)
});