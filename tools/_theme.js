// 工具子页面共享主题切换：与首页共用 localStorage('theme')，key = 'dark' | 'light'
// 在 body 末尾 script 引用即可

(function() {
    // 1. 应用主题（不闪烁：先于 DOMContentLoaded 执行）
    const saved = localStorage.getItem('theme');
    const dark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.setAttribute('data-theme', 'dark');

    function syncBtn() {
        const btn = document.getElementById('themeToggle');
        if (!btn) return;
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        btn.textContent = isDark ? '☀️ 亮色' : '🌙 暗色';
    }
    function applyTheme(dark) {
        if (dark) document.documentElement.setAttribute('data-theme', 'dark');
        else document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', dark ? 'dark' : 'light');
        syncBtn();
    }

    // 2. 注入右上角主题切换按钮到 .topbar
    document.addEventListener('DOMContentLoaded', () => {
        const topbar = document.querySelector('.topbar');
        if (!topbar) return;

        // 把 topbar 改成 flex 两端对齐
        topbar.style.display = 'flex';
        topbar.style.justifyContent = 'space-between';
        topbar.style.alignItems = 'center';

        const btn = document.createElement('button');
        btn.id = 'themeToggle';
        btn.className = 'theme-btn';
        topbar.appendChild(btn);
        syncBtn();

        btn.onclick = () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            applyTheme(!isDark);
        };
    });

    // 3. 跨标签页同步：storage 变化时跟随
    window.addEventListener('storage', (e) => {
        if (e.key !== 'theme') return;
        const wantDark = e.newValue === 'dark';
        if (wantDark) document.documentElement.setAttribute('data-theme', 'dark');
        else document.documentElement.removeAttribute('data-theme');
        syncBtn();
    });
})();
