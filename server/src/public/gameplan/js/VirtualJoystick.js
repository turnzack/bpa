// VirtualJoystick.js
// Joystick virtuel pour contrôles tactiles

class VirtualJoystick {
    constructor(baseElement, stickElement) {
        this.base = baseElement;
        this.stick = stickElement;
        this.active = false;
        this.position = { x: 0, y: 0 };
        this.maxDistance = 60; // pixels

        this.setupEvents();
    }

    setupEvents() {
        // Touch events
        this.base.addEventListener('touchstart', (e) => this.onTouchStart(e));
        this.base.addEventListener('touchmove', (e) => this.onTouchMove(e));
        this.base.addEventListener('touchend', (e) => this.onTouchEnd(e));

        // Mouse events for desktop testing
        this.base.addEventListener('mousedown', (e) => this.onMouseDown(e));
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mouseup', (e) => this.onMouseUp(e));
    }

    onTouchStart(e) {
        e.preventDefault();
        this.active = true;
    }

    onTouchMove(e) {
        if (!this.active) return;
        e.preventDefault();

        const touch = e.touches[0];
        this.updatePosition(touch.clientX, touch.clientY);
    }

    onTouchEnd(e) {
        e.preventDefault();
        this.reset();
    }

    onMouseDown(e) {
        e.preventDefault();
        this.active = true;
    }

    onMouseMove(e) {
        if (!this.active) return;
        e.preventDefault();
        this.updatePosition(e.clientX, e.clientY);
    }

    onMouseUp(e) {
        if (!this.active) return;
        e.preventDefault();
        this.reset();
    }

    updatePosition(clientX, clientY) {
        const rect = this.base.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let deltaX = clientX - centerX;
        let deltaY = clientY - centerY;

        // Limit to max distance
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance > this.maxDistance) {
            const angle = Math.atan2(deltaY, deltaX);
            deltaX = Math.cos(angle) * this.maxDistance;
            deltaY = Math.sin(angle) * this.maxDistance;
        }

        // Update stick position
        this.stick.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;

        // Normalize position (-1 to 1)
        this.position.x = deltaX / this.maxDistance;
        this.position.y = -deltaY / this.maxDistance; // Invert Y
    }

    reset() {
        this.active = false;
        this.position = { x: 0, y: 0 };
        this.stick.style.transform = 'translate(-50%, -50%)';
    }

    getPosition() {
        return this.position;
    }

    isActive() {
        return this.active;
    }
}
