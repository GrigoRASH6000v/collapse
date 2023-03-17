function trim(string) {
    return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
}

export function hasClass(el, cls) {
    if (!el || !cls) {
        return false;
    } 

    if (cls.indexOf(' ') !== -1) {
        throw new Error('className should not contain space.');
    }

    if (el.classList) {
        return el.classList.contains(cls);
    } else {
        return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }
}

export function addClass(el, cls) {
    if (!el) {
        return;
    }

    let curClass = el.className;
    const classes = (cls || '').split(' ');
  
    for (let i = 0, j = classes.length; i < j; i++) {
        const clsName = classes[i];

        if (!clsName) {
            continue;
        } 
  
        if (el.classList) {
            el.classList.add(clsName);
        } else if (!hasClass(el, clsName)) {
            curClass += ' ' + clsName;
        }
    }
    if (!el.classList) {
        el.setAttribute('class', curClass);
    }
}

export function removeClass(el, cls) {
    if (!el || !cls) {
        return;
    }

    const classes = cls.split(' ');
    let curClass = ' ' + el.className + ' ';

    for (let i = 0, j = classes.length; i < j; i++) {
        const clsName = classes[i];

        if (!clsName) {
            continue;
        }

        if (el.classList) {
            el.classList.remove(clsName);
        } else if (hasClass(el, clsName)) {
            curClass = curClass.replace(' ' + clsName + ' ', ' ');
        }
    }
    if (!el.classList) {
        el.setAttribute('class', trim(curClass));
    }
}
