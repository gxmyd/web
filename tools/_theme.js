// 工具子页面 / 书签页共享主题同步：与首页共用 localStorage('theme')，key = 'dark' | 'light'
// HTML 中需要自带 <button id="themeToggle">（在 .topbar 内），
// 这个脚本只负责：应用主题 + 同步按钮文案 + 绑定点击 + 跨标签页同步。

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

    // 2. 绑定点击 + 同步按钮（DOM 加载后）
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('themeToggle');
        if (btn) {
            syncBtn();
            btn.onclick = () => {
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                applyTheme(!isDark);
            };
        }
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
