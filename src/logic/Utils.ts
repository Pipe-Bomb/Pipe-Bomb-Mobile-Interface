export function convertArrayToString(items: string[]) {
    let out = "";
    for (let i = 0; i < items.length; i++) {
        if (i > 0) {
            if (i == items.length - 2) {
                out += " & ";
            } else {
                out += ", ";
            }
        }
        out += items[i];
    }
    return out;
}

export function formatTime(time: number) {
    let seconds: number | string = Math.floor(time);
    let minutes: number | string = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    let hours = Math.floor(minutes / 60);
    minutes -= hours * 60;

    if (seconds < 10) seconds = "0" + seconds;
    if (hours) {
        if (minutes < 10) minutes = "0" + minutes;
        return `${hours}:${minutes}:${seconds}`;
    }
    if (typeof seconds == "number") seconds = seconds.toString();
    if (isNaN(minutes) || isNaN(parseInt(seconds))) return "0:00";
    return `${minutes}:${seconds}`;
}

export function shuffle<Type>(array: Type[]) {
    const dupe = Array.from(array);
    let currentIndex = dupe.length,  randomIndex;
  
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [dupe[currentIndex], dupe[randomIndex]] = [dupe[randomIndex], dupe[currentIndex]];
    }
  
    return dupe;
}

export function removeProtocol(url: string) {
    const remove = ["http://", "https://"];
    for (let protocol of remove) {
        if (url.toLowerCase().startsWith(protocol)) {
            url = url.substring(protocol.length);
            return url;
        }
    }
    return url;
}

export async function downloadFile(url: string, filename: string) {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(link.href);
}

export function generateHash(seed?: string | number) {
    function nextHash(a: number) { 
        return function() {
          var t = a += 0x6D2B79F5;
          t = Math.imul(t ^ t >>> 15, t | 1);
          t ^= t + Math.imul(t ^ t >>> 7, t | 61);
          return ((t ^ t >>> 14) >>> 0) / 4294967296;
        }
    }

    function generate(seed: string) {
        var hash = 0, i, chr;
        if (seed.length === 0) return hash;
        for (i = 0; i < seed.length; i++) {
            chr = seed.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0;
        }
        return hash;
    }

    const anySeed: any = seed;
    let numberSeed: number;

    if (!seed) {
        seed = "";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 20; i++) {
            seed += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        numberSeed = generate(seed);
    } else if (isNaN(anySeed) || parseInt(anySeed) != parseFloat(anySeed)) {
        seed = seed.toString().substring(0, 20);
        while (seed.length < 20) seed += "0";
        numberSeed = generate(seed.toString());
    } else {
        numberSeed = parseInt(anySeed);
    }

    return nextHash(numberSeed);
}

export function wait(time: number) {
    return new Promise(resolve => {
        setTimeout(resolve, time * 1000);
    });
}

export function preciseTime() {
    return performance.now() || Date.now();
}

export function lerp(start: number, end: number, time: number, callback: (value: number) => void) {
    const delta = end - start;
    let ended = false;
    const startTime = preciseTime();

    function loop() {
        if (ended) return;
        requestAnimationFrame(loop);
        const newTime = preciseTime();
        const timeDifference = (newTime - startTime) / time;

        if (timeDifference >= 1) {
            ended = true;
            callback(end);
            return;
        }

        callback(start + delta * timeDifference);
    }
    loop();

    setTimeout(() => {
        if (ended) return;
        ended = true;
        callback(end);
    }, time);

    function prematureEnd() {
        ended = true;
        
        const newTime = preciseTime();
        const timeDifference = (newTime - startTime) / time;

        if (timeDifference >= 1) {
            return end;
        }
        return start + delta * timeDifference;
    }

    return prematureEnd;
}

export function generateNumberHash(input: string) {
    let hash = 0;
    if (!input.length) return 0;

    for (let i = 0; i < input.length; i++) {
        let chr = input.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

export function generateRandomString(length: number) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}