// --- Page Rendering Implementations ---

// Render Cargo Detail Page
window.renderCargoDetailPage = (container, cargoId) => {
    const item = (window.cargoData2 || []).find(it => it.id === cargoId) || (window.cargoData || []).find(it => it.id === cargoId);
    if (!item) {
        showToast('找不到货单数据');
        window.switchView('cargo-management-2');
        return;
    }

    // Determine Mode
    const isEditMode = ['草稿', '未接单'].includes(item.statusText);
    const pageTitle = isEditMode ? '编辑货单详情' : '货单详情';

    // Helper to generate inputs
    const renderInput = (label, value, placeholder, id = '', required = false, type = 'text') => `
        <div class="form-group">
            <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;">
                ${required ? '<span style="color:red">*</span>' : ''}${label}
            </label>
            <input type="${type}" id="${id}" value="${value || ''}" placeholder="${placeholder}" ${!isEditMode ? 'disabled' : ''} 
                   style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; ${!isEditMode ? 'background:#f8fafc;' : ''}">
        </div>
    `;

    // Waybills List HTML
    const waybillsHtml = (item.waybills && item.waybills.length > 0) ? `
        <div class="card" style="margin-bottom: 24px; padding: 20px; border-radius: 12px; box-shadow: var(--shadow-sm);">
            <h3 style="font-size: 1rem; font-weight: 700; color: #1e293b; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-layer-group" style="color: #6366f1;"></i> 关联运单列表
            </h3>
            <div style="display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px;">
                ${item.waybills.map(wb => `
                    <div onclick="window.navigateTo('waybillDetail', { id: '${wb.id}' })" 
                         style="flex-shrink: 0; min-width: 180px; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; cursor: pointer; transition: all 0.2s; hover:border-color:#4f46e5;">
                        <div style="font-weight: 600; color: #4f46e5; font-size: 0.95rem; margin-bottom: 4px;">${wb.id}</div>
                        <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 4px;">${wb.statusText} · ${wb.driver}</div>
                        <div style="font-size: 0.75rem; color: #94a3b8;">${wb.quantity}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    ` : '';

    container.innerHTML = `
        <div class="page-header" style="margin-bottom: 24px;">
            <div class="page-title" style="display: flex; align-items: center; gap: 12px;">
                <button class="btn" onclick="window.switchView('cargo-management-2')" style="background: white; border: 1px solid #e2e8f0; padding: 8px 12px;">
                    <i class="fas fa-arrow-left"></i> 返回
                </button>
                <div>
                    <h1 style="margin: 0;">${pageTitle}</h1>
                    <p style="margin: 4px 0 0 0;">单号: <span style="font-family: monospace;">${item.id}</span></p>
                </div>
            </div>
            <div style="display: flex; gap: 12px;">
                ${isEditMode ? `
                    <button class="btn" style="background: white; border: 1px solid #e2e8f0; color: #64748b;" onclick="showToast('草稿已保存')">保存草稿</button>
                    <button class="btn btn-primary" onclick="showToast('保存成功'); window.switchView('cargo-management-2');">保存并发布</button>
                ` : `
                    <span class="status-badge" style="${getStatusStyle ? getStatusStyle(item.statusText) : ''}">${item.statusText}</span>
                `}
            </div>
        </div>

        <div style="max-width: 1200px; margin: 0 auto;">
            ${waybillsHtml}

            <!-- Basic Info Card -->
            <div class="card" style="margin-bottom: 24px; padding: 24px; border-radius: 12px; box-shadow: var(--shadow-sm);">
                <h3 style="font-size: 1.1rem; font-weight: 700; color: #1e293b; margin-bottom: 20px;">基础信息</h3>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
                    ${renderInput('客户名称', item.customer ? item.customer.split('\n')[0] : '', '请输入客户名称', 'input-client', true)}
                    ${renderInput('装货地', item.start, '请选择装货地', 'input-start', true)}
                    ${renderInput('卸货地', item.end, '请选择卸货地', 'input-end', true)}
                    ${renderInput('货物名称', item.customer ? item.customer.split('\n')[1] : '', '请输入货物名称', 'input-cargo', true)}
                    ${renderInput('货物数量', item.quantity, '请输入数量', 'input-qty', true)}
                    ${renderInput('约定到达时间', item.time ? item.time.split('\n')[0] : '', '请选择时间', 'input-time', false, 'datetime-local')}
                </div>
                 <div class="form-group" style="margin-top: 24px;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;">备注</label>
                    <textarea ${!isEditMode ? 'disabled' : ''} style="width: 100%; height: 80px; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; resize: none; ${!isEditMode ? 'background:#f8fafc;' : ''}">备注内容...</textarea>
                </div>
            </div>

            <!-- Lifecycle Info for View Mode -->
            ${!isEditMode ? renderLifecycleInfo(item) : ''}
        </div>
    `;
};

// Helper to render lifecycle info blocks
window.renderLifecycleInfo = (item) => {
    let html = '';

    // Acceptance Info
    if (['已接单', '运输中', '已签收', '待评价', '已完成'].includes(item.statusText)) {
        html += `
        <div class="card" style="margin-bottom: 24px; padding: 24px; border-radius: 12px; box-shadow: var(--shadow-sm);">
             <h3 style="font-size: 1.1rem; font-weight: 700; color: #1e293b; margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-id-card" style="color: #5345ec;"></i> 接单信息
            </h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; background: #f8fbff; padding: 20px; border-radius: 12px; border: 1px solid #e0e7ff;">
                <div><label style="color:#64748b; font-size:0.85rem;">接单司机</label><div style="font-weight:600; margin-top:4px;">${item.driver || '张三'}</div></div>
                <div><label style="color:#64748b; font-size:0.85rem;">承运车队</label><div style="font-weight:600; margin-top:4px;">${item.fleet || '顺丰车队'}</div></div>
                <div><label style="color:#64748b; font-size:0.85rem;">接单时间</label><div style="font-weight:600; margin-top:4px;">${item.time?.split('\n')[0] || '2026-01-01'}</div></div>
            </div>
        </div>
        `;
    }

    // Signed Info
    if (['已签收', '待评价', '已完成'].includes(item.statusText)) {
        html += `
        <div class="card" style="margin-bottom: 24px; padding: 24px; border-radius: 12px; box-shadow: var(--shadow-sm);">
             <h3 style="font-size: 1.1rem; font-weight: 700; color: #1e293b; margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-file-signature" style="color: #10b981;"></i> 签收信息
            </h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; background: #ecfdf5; padding: 20px; border-radius: 12px; border: 1px solid #d1fae5;">
                <div><label style="color:#059669; font-size:0.85rem;">签收人</label><div style="font-weight:600; color:#065f46; margin-top:4px;">李四</div></div>
                <div><label style="color:#059669; font-size:0.85rem;">签收时间</label><div style="font-weight:600; color:#065f46; margin-top:4px;">2026-01-05 14:00</div></div>
            </div>
        </div>
        `;
    }

    return html;
};

// Render Waybill Detail Page
window.renderWaybillDetailPage = (container, waybillId) => {
    // Find parent cargo first to get base context if needed, or search flat list (mock simplification)
    // For mock purposes, we search cargoData2 first, then deep search waybills
    let waybill = null;
    let parentCargo = window.cargoData2.find(c => c.waybills && c.waybills.find(w => w.id === waybillId));
    if (parentCargo) {
        waybill = parentCargo.waybills.find(w => w.id === waybillId);
    } else {
        // Fallback for single-waybill items where ID matches
        waybill = window.cargoData2.find(c => c.id === waybillId);
    }

    if (!waybill) {
        showToast('找不到运单数据');
        window.switchView('cargo-management-2');
        return;
    }

    container.innerHTML = `
        <div class="page-header" style="margin-bottom: 24px;">
            <div class="page-title" style="display: flex; align-items: center; gap: 12px;">
                <button class="btn" onclick="window.switchView('cargo-management-2')" style="background: white; border: 1px solid #e2e8f0; padding: 8px 12px;">
                    <i class="fas fa-arrow-left"></i> 返回列表
                </button>
                <div>
                    <h1 style="margin: 0;">运单详情</h1>
                    <p style="margin: 4px 0 0 0;">运单号: <span style="font-family: monospace;">${waybill.id}</span></p>
                </div>
            </div>
            <div>
                 <span class="status-badge" style="background:#e0f2fe; color:#0369a1;">${waybill.statusText}</span>
            </div>
        </div>

        <div style="max-width: 1000px; margin: 0 auto; display: grid; gap: 24px;">
            <!-- Driver/Vehicle Card -->
            <div class="card" style="padding: 24px; border-radius: 12px; box-shadow: var(--shadow-sm);">
                <div style="display: flex; gap: 24px; align-items: center;">
                    <div style="width: 64px; height: 64px; background: #eef2ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #4f46e5; font-size: 1.5rem;">
                        <i class="fas fa-truck"></i>
                    </div>
                    <div>
                        <h3 style="font-size: 1.25rem; font-weight: 700; color: #1e293b; margin: 0 0 8px 0;">${waybill.plate || '粤B·12345'}</h3>
                        <div style="color: #64748b;">
                            <span style="margin-right: 16px;"><i class="fas fa-user"></i> ${waybill.driver || '张三'}</span>
                            <span><i class="fas fa-building"></i> ${waybill.fleet || '顺丰车队'}</span>
                        </div>
                    </div>
                     <div style="margin-left: auto; text-align: right;">
                        <div style="font-size: 1.5rem; font-weight: 700; color: #1e293b;">${waybill.quantity || '500件'}</div>
                        <div style="color: #64748b; font-size: 0.9rem;">运输数量</div>
                    </div>
                </div>
            </div>

            <!-- Tracking Card -->
             <div class="card" style="padding: 24px; border-radius: 12px; box-shadow: var(--shadow-sm);">
                <h3 style="margin-bottom: 20px; font-size: 1.1rem; font-weight: 700; color: #1e293b;">物流轨迹</h3>
                <div id="waybill-track-container"></div>
            </div>
        </div>
    `;

    // Render Track
    setTimeout(() => {
        const trackContainer = document.getElementById('waybill-track-container');
        if (trackContainer && window.renderTrackTimeline) {
            const trackPoints = window.orderTrackData[waybill.id] || window.orderTrackData['#ORD-9021'];
            window.renderTrackTimeline(trackContainer, trackPoints);
        }
    }, 0);
};
