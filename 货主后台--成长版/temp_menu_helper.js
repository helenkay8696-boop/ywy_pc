
// Helper to render action menu to avoid template literal nesting issues
window.renderActionMenu = (item) => {
    if (['草稿', '未接单'].includes(item.statusText)) return '';

    const menuItems = item.actions
        .filter(a => !['查看', '修改', '发布', '详情'].includes(a))
        .map(action => `
            <div class="menu-item" onclick="showToast('${action}操作成功'); window.toggleActionMenu('${item.id}')" 
                 style="padding: 8px 16px; cursor: pointer; color: #334155; font-size: 0.85rem; transition: background 0.2s;"
                 onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='white'">
                ${action}
            </div>
        `).join('');

    return `
        <span style="color:#cbd5e1; margin-left:8px;">|</span>
        <div style="position: relative; display: inline-block;">
            <button class="btn-text" style="color: #64748b; margin-left: 8px;" onclick="event.stopPropagation(); window.toggleActionMenu('${item.id}')">
                <i class="fas fa-ellipsis-h"></i>
            </button>
            <div id="action-menu-${item.id}" class="action-menu hidden" style="position: absolute; right: 0; top: 100%; width: 120px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); z-index: 50; padding: 4px 0; text-align: left;">
                ${menuItems}
            </div>
        </div>
    `;
};
