/**
 * Shipper Management System - Core Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

const initApp = () => {
    const navItems = document.querySelectorAll('.nav-item');
    const viewContainer = document.getElementById('view-container');

    // Navigation Click Handler
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const view = item.getAttribute('data-view');
            switchView(view);

            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Default View
    switchView('dashboard');

    // Initialize Global Data
    if (!window.cargoData) {
        window.cargoData = [
            { id: 'CG2512298376', client: '腾讯科技', route: '深圳 <i class="fas fa-arrow-right"></i> 北京', cargo: '服务器设备', amount: '500 台', date: '2025-12-30', status: 'published', statusText: '待派单', fleet: '', driver: '' },
            { id: 'CG2512298377', client: '华为终端', route: '东莞 <i class="fas fa-arrow-right"></i> 上海', cargo: '手机配件', amount: '2000 件', date: '2025-12-31', status: 'dispatched', statusText: '待装货', fleet: '顺丰车队', driver: '张三' },
            { id: 'CG2512298378', client: '比亚迪汽车', route: '西安 <i class="fas fa-arrow-right"></i> 深圳', cargo: '汽车零部件', amount: '15 吨', date: '2026-01-02', status: 'returned', statusText: '待评价', fleet: '顺丰车队', driver: '李四' },
            { id: 'CG2512298379', client: '大疆创新', route: '深圳 <i class="fas fa-arrow-right"></i> 成都', cargo: '无人机组件', amount: '300 箱', date: '2026-01-05', status: 'published', statusText: '待派单', fleet: '', driver: '' },
            { id: 'CG2512298401', client: '小米科技', route: '北京 <i class="fas fa-arrow-right"></i> 广州', cargo: '智能家居', amount: '1200 件', date: '2026-01-03', status: 'loading', statusText: '运输中', fleet: '中通物流', driver: '赵五' },
            { id: 'CG2512298402', client: '联想集团', route: '合肥 <i class="fas fa-arrow-right"></i> 武汉', cargo: '笔记本电脑', amount: '800 台', date: '2026-01-04', status: 'received', statusText: '待回单', fleet: '德邦快递', driver: '孙六' },
            { id: 'CG2512298403', client: '美团外卖', route: '上海 <i class="fas fa-arrow-right"></i> 杭州', cargo: '配送器材', amount: '50 箱', date: '2026-01-01', status: 'reviewed', statusText: '已完成', fleet: '自有车队', driver: '周七' },
            { id: 'CG2512298404', client: '宁德时代', route: '宁德 <i class="fas fa-arrow-right"></i> 常州', cargo: '锂电池块', amount: '20 吨', date: '2026-01-06', status: 'dispatched', statusText: '待装货', fleet: '苏汽物流', driver: '吴八' },
            { id: 'CG2512298405', client: '顺丰控股', route: '杭州 <i class="fas fa-arrow-right"></i> 宁波', cargo: '分拣设备', amount: '10 台', date: '2026-01-02', status: 'loading', statusText: '运输中', fleet: '顺丰快运', driver: '杨九' },
            { id: 'CG2512298406', client: '格力电器', route: '珠海 <i class="fas fa-arrow-right"></i> 重庆', cargo: '空调挂机', amount: '150 台', date: '2026-01-07', status: 'published', statusText: '待派单', fleet: '', driver: '' },
            { id: 'CG2512298407', client: '海尔智家', route: '青岛 <i class="fas fa-arrow-right"></i> 天津', cargo: '电冰箱', amount: '80 台', date: '2026-01-08', status: 'published', statusText: '待派单', fleet: '', driver: '' },
            { id: 'CG2512298408', client: '京东物流', route: '廊坊 <i class="fas fa-arrow-right"></i> 沈阳', cargo: '电商件', amount: '3000 件', date: '2026-01-09', status: 'dispatched', statusText: '待装货', fleet: '京东车队', driver: '郑十' },
            { id: 'CG2512298409', client: '美的集团', route: '佛山 <i class="fas fa-arrow-right"></i> 南昌', cargo: '微波炉', amount: '200 台', date: '2026-01-10', status: 'loading', statusText: '运输中', fleet: '安得智联', driver: '钱十一' },
            {
                id: 'CG2512298410', client: '隆基绿能', route: '西安 <i class="fas fa-arrow-right"></i> 无锡', cargo: '光伏电池板', amount: '25 吨', date: '2026-01-11', status: 'received', statusText: '待回单', fleet: '西汽集团', driver: '陈十二',
                contact: '王经理', phone: '13800138000', receiver: '江苏电力公司', receiverContact: '李工', receiverPhone: '13900139000',
                specs: '1200*1000mm', weight: '25吨', volume: '18m³', plate: '陕A·88888', actualArrival: '2026-01-11 14:20', mileage: '1280km',
                signer: '陈十二', signTime: '2026-01-11 14:35', signStatus: 'normal', receiptSn: 'RC20260111-001'
            }
        ];
    }

    // Quick Action Handler
    document.getElementById('btn-quick-publish')?.addEventListener('click', () => {
        window.openPublishCargoModal();
    });
};

const switchView = async (viewId) => {
    const container = document.getElementById('view-container');

    // Show loading
    container.innerHTML = '<div class="loading-overlay"><div class="spinner"></div></div>';

    // Simulate network delay
    setTimeout(() => {
        switch (viewId) {
            case 'dashboard':
                renderDashboard(container);
                break;
            case 'order-status':
                renderOrderStatus(container);
                break;
            case 'cargo-management':
                renderCargoManagement(container);
                break;
            case 'business-process':
                renderBusinessProcess(container);
                break;
            case 'base-data':
                renderBaseData(container);
                break;
            case 'business-config':
                renderBusinessConfig(container);
                break;
            case 'reports':
                renderReports(container);
                break;
            case 'receipt-management':
                renderReceiptManagement(container);
                break;
            case 'after-sales':
                renderAfterSales(container);
                break;
            case 'settings':
                renderSettings(container);
                break;
            case 'messages':
                renderMessages(container);
                break;
            default:
                renderPlaceholder(container, viewId);
        }
    }, 400);
};

// --- View Renderers ---

const renderDashboard = (container) => {
    container.innerHTML = `
        <div class="page-header">
            <div class="page-title">
                <h1>运营概览</h1>
                <p>欢迎回来，这是您今日的物流数据分析。</p>
            </div>
            <div class="page-actions">
                <button class="btn btn-primary"><i class="fas fa-download"></i> 导出报表</button>
            </div>
        </div>

        <div class="dashboard-grid">
            <div class="stat-card">
                <div class="stat-icon stat-icon-blue"><i class="fas fa-box"></i></div>
                <div class="stat-label">今日发布货源</div>
                <div class="stat-value">128 <span class="trend-badge trend-up">+12%</span></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon stat-icon-green"><i class="fas fa-truck-moving"></i></div>
                <div class="stat-label">在途车辆</div>
                <div class="stat-value">45 <span class="trend-badge trend-up">+5%</span></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon stat-icon-purple"><i class="fas fa-check-double"></i></div>
                <div class="stat-label">今日已完结</div>
                <div class="stat-value">86 <span class="trend-badge trend-up">+8%</span></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon stat-icon-orange"><i class="fas fa-yen-sign"></i></div>
                <div class="stat-label">待结算金额</div>
                <div class="stat-value">¥24.8k <span class="trend-badge trend-down">-2.4%</span></div>
            </div>
        </div>

        <div class="section-grid">
            <div class="card">
                <div class="card-header">
                    <h3>实时运单动态</h3>
                    <a href="#" style="font-size: 0.8rem; color: var(--primary-color);">查看全部</a>
                </div>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>运单号</th>
                            <th>线路</th>
                            <th>货物</th>
                            <th>状态</th>
                            <th>更新时间</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>#ORD-8829</td>
                            <td>广州 → 上海</td>
                            <td>精密电子 (2.5吨)</td>
                            <td><span class="status-chip status-transit">运输中</span></td>
                            <td>10:24</td>
                        </tr>
                        <tr>
                            <td>#ORD-8825</td>
                            <td>深圳 → 成都</td>
                            <td>日化用品 (8吨)</td>
                            <td><span class="status-chip status-active">待接单</span></td>
                            <td>09:15</td>
                        </tr>
                        <tr>
                            <td>#ORD-8821</td>
                            <td>北京 → 杭州</td>
                            <td>生鲜蔬果 (5吨)</td>
                            <td><span class="status-chip status-transit">运输中</span></td>
                            <td>08:45</td>
                        </tr>
                        <tr>
                            <td>#ORD-8818</td>
                            <td>上海 → 苏州</td>
                            <td>机械零件 (1.2吨)</td>
                            <td><span class="status-chip status-pending">待装货</span></td>
                            <td>08:12</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3>运力分析</h3>
                </div>
                <div style="height: 200px; display: flex; align-items: flex-end; gap: 20px; padding: 20px 0;">
                    <div style="flex: 1; height: 60%; background: var(--primary-color); border-radius: 4px; position: relative;">
                        <span style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%); font-size: 0.7rem; font-weight: bold;">Mon</span>
                    </div>
                    <div style="flex: 1; height: 85%; background: var(--primary-color); border-radius: 4px; position: relative;">
                        <span style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%); font-size: 0.7rem; font-weight: bold;">Tue</span>
                    </div>
                    <div style="flex: 1; height: 45%; background: var(--primary-color); border-radius: 4px; position: relative;">
                        <span style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%); font-size: 0.7rem; font-weight: bold;">Wed</span>
                    </div>
                    <div style="flex: 1; height: 95%; background: var(--primary-color); border-radius: 4px; position: relative;">
                        <span style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%); font-size: 0.7rem; font-weight: bold;">Thu</span>
                    </div>
                    <div style="flex: 1; height: 70%; background: var(--primary-color); border-radius: 4px; position: relative;">
                        <span style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%); font-size: 0.7rem; font-weight: bold;">Fri</span>
                    </div>
                </div>
                <div style="margin-top: 20px;">
                    <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">
                       本周运力需求持续增长，建议提前预约熟车以降低运输成本。
                    </p>
                </div>
            </div>
        </div>
    `;
};

const renderOrderStatus = (container) => {
    // 模拟数据：涵盖所有状态
    const mockOrders = [
        { id: '#ORD-9021', route: '广州天河区 → 上海浦东新区', driver: '王师傅 (9.6米厢式)', status: 'transit', statusText: '运输中', detail: '距终点145km', eta: '今日 18:00', actions: ['track'] },
        { id: '#ORD-9018', route: '中山火炬 → 常州武进', driver: '李师傅 (13米平板)', status: 'transit', statusText: '运输中', detail: '已进入江浙', eta: '明天 09:30', actions: ['track'] },
        { id: '#ORD-9022', route: '深圳南山 → 北京朝阳', driver: '未接单', status: 'pending', statusText: '未接单', detail: '等待司机接单', eta: '-', actions: ['modify', 'cancel', 'copy'] },
        { id: '#ORD-9023', route: '佛山南海 → 长沙雨花', driver: '张师傅 (4.2米)', status: 'accepted', statusText: '已接单', detail: '司机前往装货地', eta: '明日 10:00', actions: ['copy'] },
        { id: '#ORD-9015', route: '东莞松山湖 → 武汉江夏', driver: '陈师傅 (6.8米)', status: 'signed', statusText: '已签收', detail: '电子回单待上传', eta: '已送达', actions: ['track', 'rate'] },
        { id: '#ORD-9012', route: '珠海高新 → 杭州西湖', driver: '刘师傅 (9.6米)', status: 'returned', statusText: '已回单', detail: '回单审核中', eta: '已送达', actions: ['view_receipt'] },
        { id: '#ORD-9008', route: '惠州仲恺 → 南京江宁', driver: '赵师傅 (13米)', status: 'settled', statusText: '已结算', detail: '运费已支付', eta: '已送达', actions: ['view_settlement'] },
        { id: '#ORD-9005', route: '江门蓬江 → 成都双流', driver: '-', status: 'cancelled', statusText: '已取消', detail: '货主主动取消', eta: '-', actions: ['copy'] },
    ];

    container.innerHTML = `
        <div class="page-header">
            <div class="page-title">
                <h1>运单管理</h1>
                <p>全流程管理运单状态，支持新建、跟踪及异常处理。</p>
            </div>
            <button class="btn btn-primary" id="btn-create-order"><i class="fas fa-plus"></i> 新建运单</button>
        </div>
        
        <div class="card">
            <!-- Filter Bar -->
            <div style="margin-bottom: 24px; display: flex; gap: 8px; flex-wrap: wrap;">
                <button class="btn filter-btn active" data-filter="all" style="background: var(--primary-color); color: white;">全部</button>
                <button class="btn filter-btn" data-filter="pending" style="background: #f1f5f9; color: var(--text-main);">未接单</button>
                <button class="btn filter-btn" data-filter="accepted" style="background: #f1f5f9; color: var(--text-main);">已接单</button>
                <button class="btn filter-btn" data-filter="transit" style="background: #f1f5f9; color: var(--text-main);">运输中</button>
                <button class="btn filter-btn" data-filter="signed" style="background: #f1f5f9; color: var(--text-main);">已签收</button>
                <button class="btn filter-btn" data-filter="returned" style="background: #f1f5f9; color: var(--text-main);">已回单</button>
                <button class="btn filter-btn" data-filter="settled" style="background: #f1f5f9; color: var(--text-main);">已结算</button>
                <button class="btn filter-btn" data-filter="cancelled" style="background: #f1f5f9; color: var(--text-main);">已取消</button>
            </div>

            <!-- Orders Table -->
            <table class="data-table">
                <thead>
                    <tr>
                        <th>运单号</th>
                        <th>装货地 / 卸货地</th>
                        <th>司机 / 车型</th>
                        <th>当前状态</th>
                        <th>预计到达/详情</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody id="order-table-body">
                    ${renderTableRows(mockOrders)}
                </tbody>
            </table>
        </div>
    `;

    // Add functionality to filters (Simple client-side filtering)
    container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update UI
            container.querySelectorAll('.filter-btn').forEach(b => {
                b.style.background = '#f1f5f9';
                b.style.color = 'var(--text-main)';
                b.classList.remove('active');
            });
            e.target.style.background = 'var(--primary-color)';
            e.target.style.color = 'white';
            e.target.classList.add('active');

            // Filter Data
            const filterType = e.target.getAttribute('data-filter');
            const filteredData = filterType === 'all'
                ? mockOrders
                : mockOrders.filter(order => order.status === filterType);

            document.getElementById('order-table-body').innerHTML = renderTableRows(filteredData);
        });
    });
};

const renderTableRows = (orders) => {
    if (orders.length === 0) {
        return `<tr><td colspan="6" style="text-align:center; padding: 40px; color: var(--text-muted);">暂无相关运单数据</td></tr>`;
    }
    return orders.map(order => {
        let statusClass = '';
        switch (order.status) {
            case 'pending': statusClass = 'status-pending'; break; // Yellow
            case 'accepted': statusClass = 'status-active'; break; // Green
            case 'transit': statusClass = 'status-transit'; break; // Blue
            case 'signed': statusClass = 'status-active'; break;
            case 'returned': statusClass = 'status-transit'; break;
            case 'settled': statusClass = 'status-active'; break;
            case 'cancelled': statusClass = 'status-pending'; break; // Using pending style for gray/neutral if needed, or define new
            default: statusClass = 'status-pending';
        }

        // Generate Action Buttons
        let actionButtons = '';
        order.actions.forEach(action => {
            if (action === 'track') actionButtons += `<button class="btn btn-primary" style="padding: 4px 10px; font-size: 0.8rem; margin-right: 4px;">查看轨迹</button>`;
            if (action === 'modify') actionButtons += `<button class="btn" style="padding: 4px 10px; font-size: 0.8rem; border:1px solid #ddd; margin-right: 4px;">修改</button>`;
            if (action === 'cancel') actionButtons += `<button class="btn" style="padding: 4px 10px; font-size: 0.8rem; color: var(--danger-color); border:1px solid #fee2e2; margin-right: 4px;">取消</button>`;
            if (action === 'copy') actionButtons += `<button class="btn" style="padding: 4px 10px; font-size: 0.8rem; border:1px solid #ddd; margin-right: 4px;">复制</button>`;
            if (action === 'rate') actionButtons += `<button class="btn" style="padding: 4px 10px; font-size: 0.8rem; border:1px solid var(--warning-color); color: var(--warning-color); margin-right: 4px;">评价</button>`;
            if (action === 'view_receipt') actionButtons += `<button class="btn" style="padding: 4px 10px; font-size: 0.8rem; color: var(--primary-color); border:1px solid #e0f2fe; margin-right: 4px;">查看回单</button>`;
            if (action === 'view_settlement') actionButtons += `<button class="btn" style="padding: 4px 10px; font-size: 0.8rem; border:1px solid #ddd; margin-right: 4px;">查看支付</button>`;
        });

        // Special styling for Cancelled
        const statusStyle = order.status === 'cancelled' ? 'background:#f3f4f6; color:#9ca3af;' : '';
        const detailText = order.status === 'transit' ? order.detail : `<span style="color:#64748b">${order.detail}</span>`;

        return `
            <tr>
                <td>${order.id}</td>
                <td>${order.route}</td>
                <td>${order.driver}</td>
                <td><span class="status-chip ${statusClass}" style="${statusStyle}">${order.statusText}</span></td>
                <td>${order.eta}<br><span style="font-size:0.75rem">${detailText}</span></td>
                <td>${actionButtons}</td>
            </tr>
        `;
    }).join('');
};

const renderCargoManagement = (container) => {
    // Use Global Data
    const displayData = window.cargoData;

    container.innerHTML = `
        <div class="page-header">
            <div class="page-title">
                <h1>货单管理</h1>
                <p>管理货源发布、分配及运单生成。</p>
            </div>
            <button class="btn btn-primary" id="btn-publish-cargo"><i class="fas fa-plus"></i> 发布货单</button>
        </div>
        <div class="card">
            <div class="filter-tab-container">
                <div class="filter-tab active" data-filter="all">全部</div>
                <div class="filter-tab" data-filter="published">待派单</div>
                <div class="filter-tab" data-filter="dispatched">待装货</div>
                <div class="filter-tab" data-filter="loading">运输中</div>
                <div class="filter-tab" data-filter="received">待回单</div>
                <div class="filter-tab" data-filter="returned">待评价</div>
                <div class="filter-tab" data-filter="reviewed">已完成</div>
            </div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th style="width: 140px;">货单号</th>
                        <th>装货地 / 卸货地</th>
                        <th>客户 / 货物</th>
                        <th style="width: 100px;">数量 / 重量</th>
                        <th style="width: 140px;">约定时间/详情</th>
                        <th style="width: 120px;">当前状态</th>
                        <th style="width: 200px;">操作</th>
                    </tr>
                </thead>
                <tbody id="cargo-table-body">
                     ${renderCargoRows(displayData)}
                </tbody>
            </table>
        </div>
    `;

    // Publish Button Handler
    document.getElementById('btn-publish-cargo').addEventListener('click', () => {
        window.openPublishCargoModal();
    });

    // Filter Logic
    container.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            // UI Update
            container.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // Data Filter
            const filter = e.target.getAttribute('data-filter');
            const filteredData = filter === 'all' ? window.cargoData : window.cargoData.filter(item => item.status === filter);
            document.getElementById('cargo-table-body').innerHTML = renderCargoRows(filteredData);
        });
    });
};

const renderCargoRows = (data) => {
    if (data.length === 0) return `<tr><td colspan="8" style="text-align:center; padding:20px;">暂无数据</td></tr>`;
    return data.map(item => {
        let chipClass = '';
        let chipStyle = '';

        switch (item.status) {
            case 'published': chipClass = 'status-active'; break; // 待派单
            case 'dispatched': chipClass = 'status-pending'; break; // 待装货
            case 'loading': chipClass = 'status-transit'; break; // 运输中
            case 'received': chipClass = 'status-active'; break; // 待回单
            case 'returned': chipClass = 'status-transit'; chipStyle = 'background: #e9d5ff; color: #7e22ce;'; break; // 待评价
            case 'reviewed': chipClass = ''; chipStyle = 'background:#f1f5f9; color:#64748b;'; break; // 已完成
        }

        // Actions based on status
        let actions = `<button class="btn" style="padding: 4px 10px; font-size: 0.8rem; border:1px solid #ddd; margin-right: 4px;" onclick="alert('查看详情: ${item.id}')">查看</button>`;
        if (item.status === 'published') {
            actions += `<button class="btn btn-primary" style="padding: 4px 10px; font-size: 0.8rem; margin-right: 4px;" onclick="window.openDispatchModal('${item.id}')">派单</button>`;
            actions += `<button class="btn" style="padding: 4px 10px; font-size: 0.8rem; border:1px solid #e0f2fe; color: var(--primary-color);" onclick="window.openOverAreaFeeModal('${item.id}')">超区计费</button>`;
        } else if (item.status === 'dispatched') {
            actions += `<button class="btn" style="padding: 4px 10px; font-size: 0.8rem; border:1px solid #ddd; margin-right: 4px;" onclick="window.openReassignModal('${item.id}')">调单</button>`;
            actions += `<button class="btn btn-primary" style="padding: 4px 10px; font-size: 0.8rem;" onclick="window.openLoadingModal('${item.id}')">装货</button>`;
        } else if (item.status === 'loading') {
            actions += `<button class="btn" style="padding: 4px 10px; font-size: 0.8rem; color: var(--danger-color); border:1px solid #fee2e2; margin-right: 4px;" onclick="window.openAnomalyModal('${item.id}')">异常</button>`;
            actions += `<button class="btn btn-primary" style="padding: 4px 10px; font-size: 0.8rem;" onclick="window.openUnloadingModal('${item.id}')">签收</button>`;
        } else if (item.status === 'received') {
            actions += `<button class="btn" style="padding: 4px 10px; font-size: 0.8rem; color: var(--primary-color); border:1px solid #e0f2fe;" onclick="window.uploadReturnReceipt('${item.id}')">上传回单</button>`;
        } else if (item.status === 'returned') {
            actions += `<button class="btn" style="padding: 4px 10px; font-size: 0.8rem; border:1px solid var(--warning-color); color: var(--warning-color);" onclick="window.openReviewModal('${item.id}')">评价司机</button>`;
        }

        const detailInfo = item.driver ? `<div style="font-size:0.75rem; color:#64748b; margin-top:2px;">${item.driver} (${item.fleet})</div>` : '';

        return `
            <tr>
                <td><b style="color:var(--primary-color)">${item.id}</b></td>
                <td><div style="font-weight:600">${item.route}</div></td>
                <td>
                    <div style="font-weight:600">${item.client}</div>
                    <div style="font-size:0.75rem; color:#64748b">${item.cargo}</div>
                </td>
                <td>${item.amount}</td>
                <td>
                    <div>${item.date}</div>
                    ${detailInfo}
                </td>
                <td><span class="status-chip ${chipClass}" style="${chipStyle}">${item.statusText}</span></td>
                <td>
                    <div style="display:flex; flex-wrap:wrap; gap:4px;">
                        ${actions}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
};

window.openPublishCargoModal = () => {
    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = `
        <div class="modal-content" style="width: 800px; max-width: 95vw; background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9;">
                <h2 style="font-size: 1.25rem; font-weight: 700; color: #1e293b;">发布货单</h2>
                <div style="display: flex; gap: 12px;">
                     <button class="btn" onclick="document.getElementById('modal-container').classList.add('hidden')" style="background: #f1f5f9; color: #64748b;">取消</button>
                     <button class="btn btn-primary" onclick="submitNewCargo()">发布</button>
                </div>
            </div>
            
            <!-- Form Section Only -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="form-group" style="grid-column: span 1;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;">运输单号</label>
                    <input type="text" value="251229837685096" readonly style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; color: #94a3b8;">
                </div>
                <div class="form-group" style="grid-column: span 1;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;"><span style="color:red">*</span>客户名称</label>
                    <input type="text" id="input-client-name" placeholder="请输入客户名称" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px;">
                </div>

                <div class="form-group" style="grid-column: span 1;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;"><span style="color:red">*</span>装货地</label>
                    <div style="position: relative;">
                            <input type="text" id="input-loading-place" placeholder="请选择装货地" readonly onclick="openMapModal('input-loading-place')" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; background: white;">
                            <i class="fas fa-chevron-down" style="position: absolute; right: 10px; top: 12px; color: #94a3b8; pointer-events: none;"></i>
                    </div>
                </div>
                <div class="form-group" style="grid-column: span 1;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;"><span style="color:red">*</span>卸货地</label>
                    <div style="position: relative;">
                            <input type="text" id="input-unloading-place" placeholder="请选择卸货地" readonly onclick="openMapModal('input-unloading-place')" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; background: white;">
                            <i class="fas fa-chevron-down" style="position: absolute; right: 10px; top: 12px; color: #94a3b8; pointer-events: none;"></i>
                    </div>
                </div>

                <div class="form-group" style="grid-column: span 1;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;"><span style="color:red">*</span>货物名称</label>
                        <select id="input-cargo-name" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; color: #64748b; background:white;"><option value="">请选择货物名称</option><option>电子产品</option><option>普通百货</option></select>
                </div>
                <div class="form-group" style="grid-column: span 1;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;"><span style="color:red">*</span>货物数量</label>
                    <div style="display: flex; gap: 8px;">
                            <input type="text" id="input-cargo-qty" placeholder="请输入数量" style="flex: 1; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px;">
                            <select id="input-cargo-unit" style="width: 80px; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; color: #1e293b; background:white;"><option>吨</option><option>方</option><option>件</option></select>
                    </div>
                </div>

                <div class="form-group" style="grid-column: span 1;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;"><span style="color:red">*</span>约定到达时间</label>
                        <input type="datetime-local" id="input-arrival-time" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; color: #1e293b; background:white;">
                </div>
                <div class="form-group" style="grid-column: span 1;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;">约定送达时间</label>
                        <input type="datetime-local" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; color: #1e293b; background:white;">
                </div>

                <div class="form-group" style="grid-column: span 2;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;"><span style="color:red">*</span>运输凭证</label>
                        <select style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; color: #1e293b; background:white;"><option>出库单加回单</option></select>
                </div>
                
                <div class="form-group" style="grid-column: span 2;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;">服务要求</label>
                    <textarea placeholder="请输入内容" style="width: 100%; height: 80px; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; resize: none;"></textarea>
                </div>

                    <div class="form-group" style="grid-column: span 2;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;">备注</label>
                    <textarea placeholder="请输入内容" style="width: 100%; height: 80px; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; resize: none;"></textarea>
                </div>
            </div>
        </div>
    `;
    modalContainer.classList.remove('hidden');
    modalContainer.style.display = 'flex';
};

// Global for Map Modal
window.openMapModal = (inputId) => {
    // Create Map Modal if not exists, else just show it
    let mapModal = document.getElementById('map-selection-modal');
    if (!mapModal) {
        mapModal = document.createElement('div');
        mapModal.id = 'map-selection-modal';
        mapModal.className = 'modal-overlay';
        mapModal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 2000; display: flex; align-items: center; justify-content: center;';
        document.body.appendChild(mapModal);
    }

    mapModal.innerHTML = `
        <div class="modal-content" style="width: 900px; height: 600px; background: #fff; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">
            <!-- Header -->
            <div style="padding: 16px 24px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="font-size: 1.1rem; font-weight: 600;">选择地址</h3>
                <i class="fas fa-times" style="cursor: pointer; color: #94a3b8; font-size: 1.2rem;" onclick="document.getElementById('map-selection-modal').style.display='none'"></i>
            </div>
            
            <div style="flex: 1; display: flex;">
                <!-- Sidebar: Address Book -->
                <div style="width: 300px; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; background: #fff;">
                    <div style="padding: 16px; border-bottom: 1px solid #f1f5f9;">
                         <div style="display:flex; justify-content:space-between; margin-bottom:12px; align-items:center;">
                             <span style="font-weight:600;">地址簿</span>
                         </div>
                         <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-search" style="color: #94a3b8;"></i>
                            <input type="text" placeholder="搜索地址簿" style="border: none; background: transparent; outline: none; width: 100%; font-size: 0.9rem;">
                         </div>
                    </div>
                    
                    <div style="flex: 1; padding: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #94a3b8;">
                         <p>当前没有保存的地址~</p>
                    </div>
                </div>

                <!-- Main Map Area -->
                <div style="flex: 1; position: relative; background: #f0f4f8;">
                    <!-- Floating Search Bar -->
                    <div style="position: absolute; top: 20px; left: 20px; z-index: 10; display: flex; gap: 10px;">
                        <div style="background: white; border-radius: 4px; padding: 10px 15px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); font-weight: 500; font-size: 0.9rem; display: flex; items-center; gap: 8px; cursor: pointer;">
                            全国 <i class="fas fa-chevron-down" style="font-size: 0.8rem; color: #94a3b8;"></i>
                        </div>
                        <div style="background: white; border-radius: 4px; width: 300px; padding: 10px 15px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); display: flex; align-items: center;">
                             <input type="text" placeholder="请输入地址" style="border: none; outline: none; width: 100%; font-size: 0.9rem;">
                             <i class="fas fa-search" style="color: #94a3b8; cursor: pointer;"></i>
                        </div>
                    </div>

                    <!-- Map Image Sim -->
                    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 20px 20px;">
                        <i class="fas fa-map" style="font-size: 5rem; color: #e2e8f0;"></i>
                        <!-- Location Marker Tooltip -->
                        <div style="position: absolute; top: 40%; left: 55%; background: rgba(30, 41, 59, 0.9); color: white; padding: 12px; border-radius: 8px; width: 200px; font-size: 0.85rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                            1/2<br>
                            单击地图，可以输入经纬度选点，或者选择目的地附近的参照物...
                            <div style="text-align: right; margin-top: 8px;">
                                <button style="background: #4f46e5; color: white; border: none; padding: 4px 12px; border-radius: 4px; cursor: pointer;">下一个</button>
                            </div>
                            <div style="position: absolute; bottom: -6px; left: 20px; width: 12px; height: 12px; background: rgba(30, 41, 59, 0.9); transform: rotate(45deg);"></div>
                        </div>
                        <i class="fas fa-map-marker-alt" style="position: absolute; top: calc(40% + 50px); left: calc(55% + 15px); font-size: 2.5rem; color: #4f46e5; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));"></i>
                    </div>

                    <!-- Map Footer Actions -->
                    <div style="position: absolute; bottom: 0; left: 0; width: 100%; background: white; padding: 16px 24px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                         <div style="display:flex; align-items:center; gap:8px; font-size:0.9rem; color:#64748b;">
                            <i class="fas fa-location-arrow"></i> 经纬度: <span style="font-family:monospace; background:#f1f5f9; padding:2px 6px; border-radius:4px;">116.4812, 39.9904</span>
                         </div>
                         <div style="display: flex; gap: 12px;">
                             <button class="btn" onclick="document.getElementById('map-selection-modal').style.display='none'" style="border: 1px solid #e2e8f0;">确定并保存到地址簿</button>
                             <button class="btn btn-primary" onclick="confirmMapSelection('${inputId}')">确定</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    mapModal.style.display = 'flex';
}

window.confirmMapSelection = (inputId) => {
    // Simulate selection
    const address = inputId.includes('loading') ? '广东省深圳市南山区粤海街道 (模拟地址)' : '北京市朝阳区建国路88号 (模拟地址)';
    document.getElementById(inputId).value = address;
    document.getElementById('map-selection-modal').style.display = 'none';
};

window.submitNewCargo = () => {
    // 1. Get Values
    const client = document.getElementById('input-client-name').value;
    const loadPlace = document.getElementById('input-loading-place').value;
    const unloadPlace = document.getElementById('input-unloading-place').value;
    const cargoName = document.getElementById('input-cargo-name').value;
    const qty = document.getElementById('input-cargo-qty').value;
    const unit = document.getElementById('input-cargo-unit').value;
    const arrivalTime = document.getElementById('input-arrival-time').value;

    // 2. Validate
    if (!client || !loadPlace || !unloadPlace || !cargoName || !qty || !arrivalTime) {
        alert('请填写所有必填信息 (*)');
        return;
    }

    // 3. Create Object
    const newCargo = {
        id: 'CG' + Date.now().toString().slice(-10),
        client: client,
        route: `${loadPlace.split(' ')[0]} <i class="fas fa-arrow-right"></i> ${unloadPlace.split(' ')[0]}`,
        cargo: cargoName,
        amount: `${qty} ${unit}`,
        date: arrivalTime.split('T')[0],
        status: 'published',
        statusText: '已发布'
    };

    // 4. Update Data
    window.cargoData.unshift(newCargo); // Add to top

    // 5. Success UI
    document.getElementById('modal-container').classList.add('hidden');

    // Refresh List (find the active filter button or default to all)
    // For simplicity, reset to 'all' and reload
    const container = document.getElementById('view-container');
    renderCargoManagement(container); // Re-render view

    // Show Toast/Alert
    // Create a simple toast
    const toast = document.createElement('div');
    toast.style.cssText = 'position:fixed; top:20px; right:20px; background:#10b981; color:white; padding:12px 24px; border-radius:8px; box-shadow:0 4px 6px rgba(0,0,0,0.1); z-index:9999; animation: slideIn 0.3s ease-out;';
    toast.innerHTML = '<i class="fas fa-check-circle"></i> 发布成功';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
};

const renderBusinessProcess = (container) => {
    container.innerHTML = `
        <div class="page-header">
            <div class="page-title">
                <h1>业务流程</h1>
                <p>处理发货、调车、装货到评价的标准化流程。</p>
            </div>
        </div>
        <div class="dashboard-grid">
            <div class="stat-card" style="cursor:pointer" onclick="window.openPublishCargoModal()">
                <div class="stat-icon stat-icon-blue"><i class="fas fa-plus"></i></div>
                <div class="stat-label">发货</div>
                <div class="stat-value" style="font-size: 1.2rem;">发布货单</div>
            </div>
            <div class="stat-card" style="cursor:pointer" onclick="alert('进入调车流程')">
                <div class="stat-icon stat-icon-green"><i class="fas fa-user-check"></i></div>
                <div class="stat-label">调车/抢单</div>
                <div class="stat-value" style="font-size: 1.2rem;">司机接单管理</div>
            </div>
            <div class="stat-card" style="cursor:pointer" onclick="alert('进入装货流程')">
                <div class="stat-icon stat-icon-purple"><i class="fas fa-truck-loading"></i></div>
                <div class="stat-label">装货</div>
                <div class="stat-value" style="font-size: 1.2rem;">确认装货信息</div>
            </div>
            <div class="stat-card" style="cursor:pointer" onclick="alert('进入签收流程')">
                <div class="stat-icon stat-icon-orange"><i class="fas fa-file-signature"></i></div>
                <div class="stat-label">送达签收</div>
                <div class="stat-value" style="font-size: 1.2rem;">回单上传确认</div>
            </div>
        </div>
    `;
};

const renderBaseData = (container) => {
    container.innerHTML = `
        <div class="page-header">
            <div class="page-title">
                <h1>基础数据管理</h1>
                <p>管理您的用户信息、发货人信息、常用地址及认证合同。</p>
            </div>
        </div>
        <div class="dashboard-grid">
            <div class="stat-card" style="cursor:pointer">
                <div class="stat-icon stat-icon-blue"><i class="fas fa-users-cog"></i></div>
                <div class="stat-label">常用信息管理</div>
                <div class="stat-value" style="font-size: 1.1rem;">用户及地址薄</div>
            </div>
            <div class="stat-card" style="cursor:pointer">
                <div class="stat-icon stat-icon-green"><i class="fas fa-id-card"></i></div>
                <div class="stat-label">认证中心</div>
                <div class="stat-value" style="font-size: 1.1rem;">企业及资金认证</div>
            </div>
            <div class="stat-card" style="cursor:pointer">
                <div class="stat-icon stat-icon-purple"><i class="fas fa-file-contract"></i></div>
                <div class="stat-label">合同管理</div>
                <div class="stat-value" style="font-size: 1.1rem;">运输合同与分享</div>
            </div>
            <div class="stat-card" style="cursor:pointer">
                <div class="stat-icon stat-icon-orange"><i class="fas fa-receipt"></i></div>
                <div class="stat-label">发票与发票人</div>
                <div class="stat-value" style="font-size: 1.1rem;">抬头与邮寄管理</div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h3>常用发货地/目的地</h3>
                <button class="btn btn-primary" style="padding: 6px 12px; font-size: 0.8rem;">新增地址</button>
            </div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>别名</th>
                        <th>联系人</th>
                        <th>电话</th>
                        <th>详细地址</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>广州1号仓</td>
                        <td>张三</td>
                        <td>138****8888</td>
                        <td>广东省广州市天河区元岗路100号</td>
                        <td><a href="#" style="color:var(--primary-color)">编辑</a></td>
                    </tr>
                    <tr>
                        <td>上海研发中心</td>
                        <td>李四</td>
                        <td>139****9999</td>
                        <td>上海市浦东新区张江路500号</td>
                        <td><a href="#" style="color:var(--primary-color)">编辑</a></td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
};

const renderBusinessConfig = (container) => {
    container.innerHTML = `
        <div class="page-header">
            <div class="page-title">
                <h1>业务配置</h1>
                <p>自定义您的专属园区、报价策略及调度规则。</p>
            </div>
        </div>
        <div class="section-grid" style="grid-template-columns: 1fr 1fr;">
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-map-location-dot"></i> 专属园区设置</h3>
                </div>
                <p style="color:var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">
                    定义核心物流园区，系统将根据园区位置自动优化调度方案。
                </p>
                <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px dashed var(--border-color);">
                    <p style="text-align:center; color:var(--text-muted)">暂无自定义园区</p>
                </div>
                <button class="btn btn-primary" style="width: 100%; margin-top: 20px; justify-content: center;">配置专属园区</button>
            </div>
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-tags"></i> 报价策略管理</h3>
                </div>
                <p style="color:var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">
                    设置不同线路、货品类型的基准运价。
                </p>
                 <table class="data-table">
                    <tbody>
                        <tr><td>珠三角 → 长三角</td><td>¥450/吨</td></tr>
                        <tr><td>珠三角 → 成渝区</td><td>¥600/吨</td></tr>
                    </tbody>
                </table>
                <button class="btn btn-primary" style="width: 100%; margin-top: 20px; justify-content: center;">更新报价单</button>
            </div>
        </div>
    `;
};

const renderReports = (container) => {
    container.innerHTML = `
        <div class="page-header">
            <div class="page-title">
                <h1>报表统计</h1>
                <p>可视化分析物流效率、成本及司机表现。</p>
            </div>
            <div style="display:flex; gap:12px;">
                <select class="form-input" style="width: auto;"><option>最近 7 天</option><option>最近 30 天</option><option>本月</option></select>
                <button class="btn btn-primary"><i class="fas fa-download"></i> 导出报表</button>
            </div>
        </div>

        <div class="dashboard-grid">
            <div class="stat-card">
                <h3>累计运单量</h3>
                <div class="value">1,248</div>
                <div class="trend up"><span><i class="fas fa-arrow-up"></i> 12.5%</span> 较上周</div>
            </div>
            <div class="stat-card">
                <h3>准时到达率</h3>
                <div class="value">98.5%</div>
                <div class="progress-bar"><div class="fill" style="width: 98.5%"></div></div>
            </div>
            <div class="stat-card">
                <h3>平均结算周期</h3>
                <div class="value">3.2天</div>
                <div class="trend down"><span><i class="fas fa-arrow-down"></i> 0.5天</span> 效率提升</div>
            </div>
            <div class="stat-card">
                <h3>客户满意度</h3>
                <div class="value">4.9/5.0</div>
                <div style="color: var(--warning-color); font-size: 0.9rem;"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
            </div>
        </div>

        <div class="section-grid" style="grid-template-columns: 2fr 1fr; margin-top: 24px;">
            <!-- Trend Analysis (Line Chart Simulation) -->
            <div class="card">
                <div class="card-header">
                    <h3>发货统计收货统计 (按发货日期)</h3>
                </div>
                <div style="height: 300px; display: flex; align-items: flex-end; justify-content: space-between; padding: 20px 0; position: relative;">
                    <!-- Simple CSS/SVG Chart -->
                    <svg viewBox="0 0 800 200" style="width: 100%; height: 100%; overflow: visible;">
                        <!-- Grid Lines -->
                        <line x1="0" y1="0" x2="800" y2="0" stroke="#f1f5f9" stroke-width="1" />
                        <line x1="0" y1="50" x2="800" y2="50" stroke="#f1f5f9" stroke-width="1" />
                        <line x1="0" y1="100" x2="800" y2="100" stroke="#f1f5f9" stroke-width="1" />
                        <line x1="0" y1="150" x2="800" y2="150" stroke="#f1f5f9" stroke-width="1" />
                        
                        <!-- Line: Receipt (Green) -->
                        <path d="M0,150 Q100,50 200,80 T400,40 T600,90 T800,20" fill="none" stroke="#10b981" stroke-width="3" />
                         <!-- Area: Receipt -->
                         <path d="M0,150 Q100,50 200,80 T400,40 T600,90 T800,20 V200 H0 Z" fill="rgba(16, 185, 129, 0.1)" stroke="none" />

                        <!-- Line: Shipment (Blue) -->
                        <path d="M0,180 Q100,100 200,120 T400,60 T600,110 T800,150" fill="none" stroke="#4f46e5" stroke-width="3" />
                    </svg>
                    <!-- X-Axis Labels (Simulated) -->
                    <div style="position: absolute; bottom: -25px; left: 0; right: 0; display: flex; justify-content: space-between; color: var(--text-muted); font-size: 0.8rem;">
                        <span>12-01</span><span>12-05</span><span>12-10</span><span>12-15</span><span>12-20</span><span>12-25</span>
                    </div>
                </div>
                 <div style="display: flex; justify-content: center; gap: 24px; margin-top: 20px;">
                    <div style="display: flex; align-items: center; gap: 8px;"><div style="width: 12px; height: 12px; background: #4f46e5; border-radius: 50%;"></div> 发货量</div>
                    <div style="display: flex; align-items: center; gap: 8px;"><div style="width: 12px; height: 12px; background: #10b981; border-radius: 50%;"></div> 收货量</div>
                </div>
            </div>

            <!-- Shipment vs Receipt Mock Bar -->
            <div class="card">
                <div class="card-header">
                    <h3>收发货概览</h3>
                </div>
                <div style="display: flex; flex-direction: column; gap: 24px; justify-content: center; height: 300px;">
                    <div style="text-align: center;">
                         <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 8px;">总发货量</div>
                         <div style="font-size: 2rem; font-weight: 700; color: #4f46e5;">856 <span style="font-size: 1rem; color: #4f46e5;">单</span></div>
                    </div>
                    <div style="width: 100%; height: 1px; background: #f1f5f9;"></div>
                    <div style="text-align: center;">
                         <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 8px;">总收货量</div>
                         <div style="font-size: 2rem; font-weight: 700; color: #10b981;">1,042 <span style="font-size: 1rem; color: #10b981;">单</span></div>
                    </div>
                     <div style="width: 100%; height: 1px; background: #f1f5f9;"></div>
                     <div style="text-align: center;">
                         <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 8px;">收发平衡指数</div>
                         <div style="font-size: 1.5rem; font-weight: 700; color: #f59e0b;">1.21</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Vehicle Statistics Table -->
        <div class="card" style="margin-top: 24px;">
            <div class="card-header">
                <h3>车牌统计收货量</h3>
                <!-- Filters -->
                 <div style="display: flex; gap: 10px;">
                    <input type="text" class="form-input" placeholder="输入车牌号搜索..." style="width: 200px; padding: 6px 12px;">
                </div>
            </div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>排名</th>
                        <th>车牌号码</th>
                        <th>常跑路线</th>
                        <th>总收货单数</th>
                        <th>收货总吨位</th>
                        <th>准点率</th>
                        <th>综合评分</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><span style="display:inline-block; width:24px; height:24px; background:#fef3c7; color:#d97706; text-align:center; border-radius:4px; font-weight:bold;">1</span></td>
                        <td>粤A·88888</td>
                        <td>广州 - 长沙</td>
                        <td>428</td>
                        <td>6,840 吨</td>
                        <td>99.2%</td>
                        <td><span style="color:#f59e0b">★★★★★</span></td>
                    </tr>
                    <tr>
                        <td><span style="display:inline-block; width:24px; height:24px; background:#e0f2fe; color:#0369a1; text-align:center; border-radius:4px; font-weight:bold;">2</span></td>
                        <td>粤B·66666</td>
                        <td>深圳 - 武汉</td>
                        <td>356</td>
                        <td>5,200 吨</td>
                        <td>98.5%</td>
                        <td><span style="color:#f59e0b">★★★★★</span></td>
                    </tr>
                     <tr>
                        <td><span style="display:inline-block; width:24px; height:24px; background:#f1f5f9; color:#64748b; text-align:center; border-radius:4px; font-weight:bold;">3</span></td>
                        <td>湘A·12345</td>
                        <td>长沙 - 常德</td>
                        <td>289</td>
                        <td>3,100 吨</td>
                        <td>97.8%</td>
                        <td><span style="color:#f59e0b">★★★★☆</span></td>
                    </tr>
                     <tr>
                        <td>4</td>
                        <td>鄂A·56789</td>
                        <td>武汉 - 宜昌</td>
                        <td>145</td>
                        <td>1,800 吨</td>
                        <td>96.5%</td>
                        <td><span style="color:#f59e0b">★★★★☆</span></td>
                    </tr>
                     <tr>
                        <td>5</td>
                        <td>苏B·99999</td>
                        <td>无锡 - 上海</td>
                        <td>112</td>
                        <td>980 吨</td>
                        <td>98.0%</td>
                        <td><span style="color:#f59e0b">★★★★</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
};

const renderAfterSales = (container) => {
    // 模拟数据
    const mockClaims = [
        { id: '#AS-102', orderId: '#ORD-8821', type: '货物破损', status: 'pending', statusText: '处理中', time: '2025-12-23 09:00' },
        { id: '#AS-103', orderId: '#ORD-9022', type: '运费争议', status: 'pending', statusText: '待协商', time: '2025-12-24 11:30' },
        { id: '#AS-101', orderId: '#ORD-8750', type: '运输时效延迟', status: 'processed', statusText: '已结案', time: '2025-12-21 14:20' },
        { id: '#AS-100', orderId: '#ORD-8600', type: '货物丢失', status: 'processed', statusText: '已赔付', time: '2025-12-18 09:00' }
    ];

    container.innerHTML = `
        <div class="page-header">
            <div class="page-title">
                <h1>售后管理</h1>
                <p>处理异常反馈、投诉建议及理赔申请。</p>
            </div>
            <button class="btn btn-primary" onclick="alert('新建售后工单')"><i class="fas fa-plus"></i> 新建工单</button>
        </div>
        
        <div class="card">
             <!-- Tabs -->
             <div style="margin-bottom: 24px; display: flex; border-bottom: 1px solid var(--border-color);">
                <div class="tab-item active" data-tab="pending" style="padding: 12px 24px; cursor: pointer; border-bottom: 2px solid var(--primary-color); font-weight: 600; color: var(--primary-color);">未处理</div>
                <div class="tab-item" data-tab="processed" style="padding: 12px 24px; cursor: pointer; border-bottom: 2px solid transparent; color: var(--text-muted);">已处理</div>
            </div>

            <table class="data-table">
                <thead>
                    <tr>
                        <th>工单号</th>
                        <th>关联运单</th>
                        <th>类型</th>
                        <th>状态</th>
                        <th>反馈时间</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody id="as-table-body">
                    ${renderClaimRows(mockClaims.filter(c => c.status === 'pending'))}
                </tbody>
            </table>
        </div>
        
        <!-- Detail Modal Container -->
        <div id="as-detail-modal" class="modal-overlay hidden" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center;">
            <div class="modal-content" style="background: white; width: 800px; max-height: 90vh; overflow-y: auto; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">
                <!-- Content injected here -->
            </div>
        </div>
    `;

    // Tab Switching Logic
    container.querySelectorAll('.tab-item').forEach(tab => {
        tab.addEventListener('click', (e) => {
            // Update Tab UI
            container.querySelectorAll('.tab-item').forEach(t => {
                t.classList.remove('active');
                t.style.borderBottomColor = 'transparent';
                t.style.color = 'var(--text-muted)';
            });
            e.target.classList.add('active');
            e.target.style.borderBottomColor = 'var(--primary-color)';
            e.target.style.color = 'var(--primary-color)';

            // Filter Data
            const tabType = e.target.getAttribute('data-tab');
            const filteredData = mockClaims.filter(c => c.status === tabType);
            document.getElementById('as-table-body').innerHTML = renderClaimRows(filteredData);
        });
    });

    // Close Modal Logic (Global click outside)
    window.onclick = (event) => {
        const modal = document.getElementById('as-detail-modal');
        if (event.target == modal) {
            modal.classList.add('hidden');
        }
    }
};

const renderClaimRows = (claims) => {
    if (claims.length === 0) return `<tr><td colspan="6" style="text-align:center; padding: 40px; color:#9ca3af;">暂无数据</td></tr>`;

    return claims.map(claim => {
        let statusColor = claim.status === 'pending' ? '#ef4444' : '#10b981';
        let bg = claim.status === 'pending' ? '#fee2e2' : '#dcfce7';
        let btn = claim.status === 'processed'
            ? `<button class="btn" onclick="openClaimDetail('${claim.id}')" style="padding:4px 10px; font-size:0.8rem; border:1px solid #e2e8f0; color:var(--primary-color)">查看详情</button>`
            : `<button class="btn" style="padding:4px 10px; font-size:0.8rem; background:var(--primary-color); color:white;">去处理</button>`;

        return `
            <tr>
                <td>${claim.id}</td>
                <td>${claim.orderId}</td>
                <td>${claim.type}</td>
                <td><span class="status-chip" style="background:${bg}; color:${statusColor}">${claim.statusText}</span></td>
                <td>${claim.time}</td>
                <td>${btn}</td>
            </tr>
        `;
    }).join('');
};

// Global function for onclick access
window.openClaimDetail = (claimId) => {
    const modal = document.getElementById('as-detail-modal');
    modal.classList.remove('hidden');
    modal.querySelector('.modal-content').innerHTML = `
        <div style="padding: 24px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
                <h2>售后详情 ${claimId}</h2>
                <button onclick="document.getElementById('as-detail-modal').classList.add('hidden')" style="background:none; border:none; font-size:1.5rem; cursor:pointer;">&times;</button>
            </div>

            <!-- Status Banner -->
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 8px; margin-bottom: 24px; color: #15803d; display:flex; align-items:center; gap:12px;">
                <i class="fas fa-check-circle" style="font-size: 1.2rem;"></i>
                <div>
                    <strong>已完结 (赔付成功)</strong>
                    <p style="font-size: 0.9rem; margin-top: 4px;">该工单已根据双方协商结果完成赔付，赔付金已打入对方账户。</p>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                <!-- Negotiation History -->
                <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
                    <h3 style="margin-bottom: 16px; font-size: 1.1rem;">协商历史记录</h3>
                    <div style="display: flex; flex-direction: column; gap: 16px; font-size: 0.9rem;">
                         <div style="display:flex; gap:10px;">
                            <div style="width:32px; height:32px; background:#eff6ff; color:#3b82f6; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0;">我</div>
                            <div style="background:#f8fafc; padding:10px; border-radius:8px;">
                                <p style="font-weight:600; font-size:0.8rem; margin-bottom:4px; color:#64748b;">2025-12-18 09:30</p>
                                <p>收到货损反馈，请提供卸货时的照片证明。</p>
                            </div>
                        </div>
                        <div style="display:flex; gap:10px;">
                            <div style="width:32px; height:32px; background:#fef3c7; color:#d97706; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0;">司</div>
                            <div style="background:#fffbeb; padding:10px; border-radius:8px;">
                                <p style="font-weight:600; font-size:0.8rem; margin-bottom:4px; color:#64748b;">2025-12-18 10:15</p>
                                <p>照片已上传。是因为路况颠簸导致包装破损。</p>
                                <p style="margin-top:4px; color:var(--primary-color); cursor:pointer"><i class="fas fa-image"></i> image_01.jpg</p>
                            </div>
                        </div>
                         <div style="display:flex; gap:10px;">
                            <div style="width:32px; height:32px; background:#eff6ff; color:#3b82f6; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0;">我</div>
                            <div style="background:#f8fafc; padding:10px; border-radius:8px;">
                                <p style="font-weight:600; font-size:0.8rem; margin-bottom:4px; color:#64748b;">2025-12-18 11:00</p>
                                <p>确认属实。按合同约定，将赔付货物损失费 ¥500。</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Money Flow Details -->
                <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
                     <h3 style="margin-bottom: 16px; font-size: 1.1rem;">钱款去向详情</h3>
                     <div style="background:#f8fafc; padding:16px; border-radius:8px; margin-bottom:16px;">
                        <span style="display:block; font-size:0.8rem; color:#64748b; margin-bottom:4px;">赔付金额</span>
                        <span style="font-size:1.5rem; font-weight:700; color:#ef4444;">- ¥500.00</span>
                     </div>
                     
                     <div style="display:flex; flex-direction:column; gap:12px; font-size:0.9rem;">
                        <div style="display:flex; justify-content:space-between;">
                            <span style="color:#64748b">交易单号</span>
                            <span>TXN8829301928</span>
                        </div>
                        <div style="display:flex; justify-content:space-between;">
                            <span style="color:#64748b">对方账户</span>
                            <span>李* (工商银行)</span>
                        </div>
                         <div style="display:flex; justify-content:space-between;">
                            <span style="color:#64748b">支付时间</span>
                            <span>2025-12-18 14:00:22</span>
                        </div>
                        <div style="display:flex; justify-content:space-between;">
                            <span style="color:#64748b">支付方式</span>
                            <span>平台余额支付</span>
                        </div>
                         <div style="display:flex; justify-content:space-between;">
                            <span style="color:#64748b">备注</span>
                            <span>货损赔偿</span>
                        </div>
                         <div style="margin-top:12px; padding-top:12px; border-top:1px dashed #e2e8f0; text-align:center;">
                             <a href="#" style="color:var(--primary-color);">查看电子回单</a>
                         </div>
                     </div>
                </div>
            </div>
        </div>
    `;
};

const renderSettings = (container) => {
    container.innerHTML = `
        <div class="page-header">
            <div class="page-title">
                <h1>账号与安全</h1>
                <p>管理您的个人账号、修改密码及设置通知偏好。</p>
            </div>
        </div>
        <div class="card" style="max-width: 600px;">
            <div style="margin-bottom: 24px;">
                <label style="display:block; margin-bottom:8px; font-weight:600;">用户名</label>
                <input type="text" value="货主管理员" readonly style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background:#f8fafc;">
            </div>
            <div style="margin-bottom: 24px;">
                <label style="display:block; margin-bottom:8px; font-weight:600;">手机号</label>
                <input type="text" value="138****8888" readonly style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background:#f8fafc;">
            </div>
            <div style="margin-bottom: 24px;">
                <label style="display:block; margin-bottom:8px; font-weight:600;">登录密码</label>
                <div style="display:flex; gap:10px;">
                    <input type="password" value="********" readonly style="flex:1; padding:10px; border-radius:8px; border:1px solid var(--border-color); background:#f8fafc;">
                    <button class="btn" style="border:1px solid var(--primary-color); color:var(--primary-color)">修改密码</button>
                </div>
            </div>
            <div style="padding:20px 0; border-top:1px solid var(--border-color); display:flex; justify-content:flex-end;">
                <button class="btn btn-primary">保存设置</button>
            </div>
        </div>
    `;
};

const renderMessages = (container) => {
    container.innerHTML = `
        <div class="page-header">
            <div class="page-title">
                <h1>消息提醒</h1>
                <p>获取运单动态、系统通知及专属推荐。</p>
            </div>
        </div>
        <div class="card">
            <div class="nav-item active" style="margin:0 0 10px 0; background:#eff6ff; color:var(--text-main); justify-content:space-between">
                <span>[运单动态] 您的运单 #ORD-9021 已进入广州区域，预计2小时内送达。</span>
                <span style="font-size:0.75rem; color:var(--text-muted)">10:45</span>
            </div>
            <div class="nav-item" style="margin:0 0 10px 0; border:1px solid #f1f5f9; color:var(--text-main); justify-content:space-between">
                <span>[系统通知] 您的企业认证已通过审核。</span>
                <span style="font-size:0.75rem; color:var(--text-muted)">昨天</span>
        <div class="nav-item" style="margin:0 0 10px 0; border:1px solid #f1f5f9; color:var(--text-main); justify-content:space-between">
                <span>[专属推荐] 发现有3台匹配您线路的回程车，点击查看。</span>
                <span style="font-size:0.75rem; color:var(--text-muted)">前天</span>
            </div>
        </div>
    `;
};

// --- Operational Modals ---

window.openDispatchModal = (cargoId) => {
    const cargo = window.cargoData.find(c => c.id === cargoId);
    if (!cargo) return;

    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = `
        <div class="modal-content" style="width: 500px; background: #fff; border-radius: 16px; padding: 24px; box-shadow: var(--shadow-md);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9;">
                <h2 style="font-size: 1.1rem; font-weight: 700;">派单: ${cargoId}</h2>
                <i class="fas fa-times" style="cursor: pointer; color: #94a3b8;" onclick="document.getElementById('modal-container').classList.add('hidden')"></i>
            </div>
            
            <div class="form-group" style="margin-bottom: 16px;">
                <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;">承运车队/运输公司</label>
                <select id="dispatch-fleet" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <option value="顺丰车队">顺丰车队</option>
                    <option value="京东物流">京东物流</option>
                    <option value="中通快运">中通快运</option>
                </select>
            </div>

            <div class="form-group" style="margin-bottom: 24px;">
                <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;">选择司机</label>
                <select id="dispatch-driver" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <option value="张三 (粤B·88888)">张三 (粤B·88888)</option>
                    <option value="李四 (粤B·66666)">李四 (粤B·66666)</option>
                    <option value="王五 (粤B·11111)">王五 (粤B·11111)</option>
                </select>
            </div>

            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                 <button class="btn" onclick="document.getElementById('modal-container').classList.add('hidden')" style="background: #f1f5f9; color: #64748b;">取消</button>
                 <button class="btn btn-primary" onclick="confirmDispatch('${cargoId}')">确认派单</button>
            </div>
        </div>
    `;
    modalContainer.classList.remove('hidden');
    modalContainer.style.display = 'flex';
};

window.confirmDispatch = (cargoId) => {
    const fleet = document.getElementById('dispatch-fleet').value;
    const driver = document.getElementById('dispatch-driver').value;
    const cargo = window.cargoData.find(c => c.id === cargoId);
    if (cargo) {
        cargo.status = 'dispatched';
        cargo.statusText = '待装货';
        cargo.fleet = fleet;
        cargo.driver = driver;
        refreshCargoManagement();
        document.getElementById('modal-container').classList.add('hidden');
        showToast('派单成功！已通知车队及旗下司机批量接单');
    }
};

window.openReassignModal = (cargoId) => {
    const cargo = window.cargoData.find(c => c.id === cargoId);
    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = `
        <div class="modal-content" style="width: 500px; background: #fff; border-radius: 16px; padding: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9;">
                <h2 style="font-size: 1.1rem; font-weight: 700;">司机调单</h2>
                <i class="fas fa-times" style="cursor: pointer; color: #94a3b8;" onclick="document.getElementById('modal-container').classList.add('hidden')"></i>
            </div>
            <p style="font-size: 0.9rem; color: #64748b; margin-bottom: 16px;">原司机: <b>${cargo.driver}</b></p>
            <div class="form-group" style="margin-bottom: 16px;">
                <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;">更换为新司机 (同车队)</label>
                <select id="reassign-driver" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <option value="赵六 (粤B·22222)">赵六 (粤B·22222)</option>
                    <option value="钱七 (粤B·33333)">钱七 (粤B·33333)</option>
                </select>
            </div>
            <div class="form-group" style="margin-bottom: 24px;">
                <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;">调单原因</label>
                <textarea placeholder="例如：原司机突发状况无法承运" style="width: 100%; height: 80px; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; resize: none;"></textarea>
            </div>
            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                 <button class="btn" onclick="document.getElementById('modal-container').classList.add('hidden')" style="background: #f1f5f9; color: #64748b;">取消</button>
                 <button class="btn btn-primary" onclick="confirmReassign('${cargoId}')">确认调单</button>
            </div>
        </div>
    `;
    modalContainer.classList.remove('hidden');
    modalContainer.style.display = 'flex';
};

window.confirmReassign = (cargoId) => {
    const newDriver = document.getElementById('reassign-driver').value;
    const cargo = window.cargoData.find(c => c.id === cargoId);
    if (cargo) {
        cargo.driver = newDriver;
        refreshCargoManagement();
        document.getElementById('modal-container').classList.add('hidden');
        showToast('调单成功');
    }
};

window.openLoadingModal = (cargoId) => {
    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = `
        <div class="modal-content" style="width: 500px; background: #fff; border-radius: 16px; padding: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9;">
                <h2 style="font-size: 1.1rem; font-weight: 700;">开始装货</h2>
                <i class="fas fa-times" style="cursor: pointer; color: #94a3b8;" onclick="document.getElementById('modal-container').classList.add('hidden')"></i>
            </div>
            <div class="form-group" style="margin-bottom: 16px;">
                <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;">过磅重量 (吨)</label>
                <input type="number" id="loading-weight" placeholder="请输入实际重量" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px;">
            </div>
            <div class="form-group" style="margin-bottom: 16px;">
                <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;">装货单据/物流单拍照</label>
                <div style="border: 2px dashed #e2e8f0; border-radius: 8px; padding: 20px; text-align: center; color: #94a3b8; cursor: pointer;">
                    <i class="fas fa-camera" style="font-size: 1.5rem; margin-bottom: 8px;"></i>
                    <p style="font-size: 0.8rem;">点击上传装货凭证</p>
                </div>
            </div>
            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                 <button class="btn btn-primary" onclick="confirmLoading('${cargoId}')">确认完成装货</button>
            </div>
        </div>
    `;
    modalContainer.classList.remove('hidden');
    modalContainer.style.display = 'flex';
};

window.confirmLoading = (cargoId) => {
    const cargo = window.cargoData.find(c => c.id === cargoId);
    if (cargo) {
        cargo.status = 'loading';
        cargo.statusText = '运输中';
        refreshCargoManagement();
        document.getElementById('modal-container').classList.add('hidden');
        showToast('装货完成，运单已转入运输中状态');
    }
};

window.confirmReceipt = (cargoId) => {
    if (confirm('确认货物已安全送达并签收？')) {
        const cargo = window.cargoData.find(c => c.id === cargoId);
        if (cargo) {
            cargo.status = 'received';
            cargo.statusText = '待回单';
            refreshCargoManagement();
            showToast('签收成功');
        }
    }
};

window.uploadReturnReceipt = (cargoId) => {
    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = `
        <div class="modal-content" style="width: 500px; background: #fff; border-radius: 16px; padding: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9;">
                <h2 style="font-size: 1.1rem; font-weight: 700;">上传回单</h2>
                <i class="fas fa-times" style="cursor: pointer; color: #94a3b8;" onclick="document.getElementById('modal-container').classList.add('hidden')"></i>
            </div>
            <div style="border: 2px dashed #e2e8f0; border-radius: 8px; padding: 30px; text-align: center; color: #94a3b8; cursor: pointer;">
                <i class="fas fa-file-upload" style="font-size: 2rem; margin-bottom: 12px;"></i>
                <p>点击或拖拽上传回单扫描件/照片</p>
            </div>
            <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;">
                 <button class="btn btn-primary" onclick="confirmReturnReceipt('${cargoId}')">提交回单</button>
            </div>
        </div>
    `;
    modalContainer.classList.remove('hidden');
    modalContainer.style.display = 'flex';
};

window.confirmReturnReceipt = (cargoId) => {
    const cargo = window.cargoData.find(c => c.id === cargoId);
    if (cargo) {
        cargo.status = 'returned';
        cargo.statusText = '待评价';
        refreshCargoManagement();
        document.getElementById('modal-container').classList.add('hidden');
        showToast('电子回单已提交审核（触发首笔款支付），纸质回单寄送中');
    }
};

window.openReviewModal = (cargoId) => {
    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = `
        <div class="modal-content" style="width: 500px; background: #fff; border-radius: 16px; padding: 24px;">
             <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9;">
                <h2 style="font-size: 1.1rem; font-weight: 700;">服务互评</h2>
                <i class="fas fa-times" style="cursor: pointer; color: #94a3b8;" onclick="document.getElementById('modal-container').classList.add('hidden')"></i>
            </div>

             <div style="margin-bottom: 20px;">
                <label style="display: block; font-size: 0.9rem; font-weight: 600; color: #64748b; margin-bottom: 12px;">评价司机服务 (人工打分)</label>
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div>
                        <p style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 4px;">服务态度</p>
                        <div style="color: #f59e0b; font-size: 1.2rem; display: flex; gap: 4px;">
                            <i class="fas fa-star" style="cursor:pointer"></i><i class="fas fa-star" style="cursor:pointer"></i><i class="fas fa-star" style="cursor:pointer"></i><i class="fas fa-star" style="cursor:pointer"></i><i class="far fa-star" style="cursor:pointer"></i>
                        </div>
                    </div>
                    <div>
                        <p style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 4px;">运输速度</p>
                        <div style="color: #f59e0b; font-size: 1.2rem; display: flex; gap: 4px;">
                            <i class="fas fa-star" style="cursor:pointer"></i><i class="fas fa-star" style="cursor:pointer"></i><i class="fas fa-star" style="cursor:pointer"></i><i class="fas fa-star" style="cursor:pointer"></i><i class="fas fa-star" style="cursor:pointer"></i>
                        </div>
                    </div>
                </div>
             </div>

             <div style="margin-bottom: 24px;">
                <label style="display: block; font-size: 0.9rem; font-weight: 600; color: #64748b; margin-bottom: 12px;">写下评价</label>
                <textarea placeholder="对货主/司机的评价内容..." style="width: 100%; height: 100px; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; resize: none;"></textarea>
             </div>

             <div style="display: flex; gap: 12px; justify-content: flex-end;">
                 <button class="btn btn-primary" onclick="confirmReview('${cargoId}')">提交互评</button>
            </div>
        </div>
    `;
    modalContainer.classList.remove('hidden');
    modalContainer.style.display = 'flex';
};

window.confirmReview = (cargoId) => {
    const cargo = window.cargoData.find(c => c.id === cargoId);
    if (cargo) {
        cargo.status = 'reviewed';
        cargo.statusText = '已完成';
        refreshCargoManagement();
        document.getElementById('modal-container').classList.add('hidden');
        showToast('感谢您的评价！');
    }
};

const refreshCargoManagement = () => {
    const container = document.getElementById('view-container');
    renderCargoManagement(container);
};

const showToast = (message) => {
    const toast = document.createElement('div');
    toast.style.cssText = 'position:fixed; top:20px; right:20px; background:#10b981; color:white; padding:12px 24px; border-radius:8px; box-shadow:var(--shadow-md); z-index:9999; animation: slideIn 0.3s ease-out;';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
};

// --- New Features (Advanced Lifecycle) ---

window.openAnomalyModal = (cargoId) => {
    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = `
        <div class="modal-content" style="width: 500px; background: #fff; border-radius: 16px; padding: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9;">
                <h2 style="font-size: 1.1rem; font-weight: 700;">运输中异常上报</h2>
                <i class="fas fa-times" style="cursor: pointer; color: #94a3b8;" onclick="document.getElementById('modal-container').classList.add('hidden')"></i>
            </div>
            
            <div class="form-group" style="margin-bottom: 16px;">
                <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;">附加费用申请 (如：进仓费)</label>
                <div style="display: flex; gap: 8px;">
                    <input type="number" id="extra-fee" placeholder="请输入金额" style="flex: 1; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <button class="btn btn-primary" style="padding: 10px 16px;">申请</button>
                </div>
            </div>

            <div class="form-group" style="margin-bottom: 24px;">
                <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;">异常描述</label>
                <textarea id="anomaly-desc" placeholder="请输入运输途中遇到的异常情况..." style="width: 100%; height: 100px; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; resize: none;"></textarea>
            </div>

            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                 <button class="btn" onclick="document.getElementById('modal-container').classList.add('hidden')" style="background: #f1f5f9; color: #64748b;">取消</button>
                 <button class="btn btn-primary" onclick="window.confirmAnomaly('${cargoId}')">上报异常</button>
            </div>
        </div>
    `;
    modalContainer.classList.remove('hidden');
    modalContainer.style.display = 'flex';
};

window.confirmAnomaly = (cargoId) => {
    const fee = document.getElementById('extra-fee').value;
    const desc = document.getElementById('anomaly-desc').value;
    if (!desc) return alert('请输入异常描述');

    document.getElementById('modal-container').classList.add('hidden');
    showToast(`异常已上报平台 ${fee ? '及费用申请 ¥' + fee : ''}`);
};

window.openUnloadingModal = (cargoId) => {
    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = `
        <div class="modal-content" style="width: 500px; background: #fff; border-radius: 16px; padding: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9;">
                <h2 style="font-size: 1.1rem; font-weight: 700;">货物卸货签收</h2>
                <i class="fas fa-times" style="cursor: pointer; color: #94a3b8;" onclick="document.getElementById('modal-container').classList.add('hidden')"></i>
            </div>
            
            <div class="form-group" style="margin-bottom: 16px;">
                <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;">卸货过磅重量 (吨)</label>
                <input type="number" id="unloading-weight" placeholder="请输入实际卸货重量" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px;">
            </div>

            <div class="form-group" style="margin-bottom: 16px;">
                <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;">上传卸货单据</label>
                <div style="border: 2px dashed #e2e8f0; border-radius: 8px; padding: 20px; text-align: center; color: #94a3b8; cursor: pointer;">
                    <i class="fas fa-camera" style="font-size: 1.2rem; margin-bottom: 8px;"></i>
                    <p style="font-size: 0.75rem;">拍照并上传卸货凭证</p>
                </div>
            </div>

            <div id="qr-code-section" style="display:none; text-align:center; padding: 20px; background: #f8fafc; border-radius: 12px; margin-top: 10px;">
                <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 12px;">请出示订单二维码供收货方扫码签收</p>
                <div style="width: 150px; height: 150px; background: white; margin: 0 auto; display: flex; align-items: center; justify-content: center; border: 4px solid #fff; box-shadow: var(--shadow-sm);">
                    <i class="fas fa-qrcode" style="font-size: 8rem; color: #1e293b;"></i>
                </div>
                <button class="btn btn-primary" style="margin-top: 16px; width: 100%;" onclick="window.completeScanReceipt('${cargoId}')">收货方已扫码</button>
            </div>

            <div id="loading-btn-section" style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px;">
                 <button class="btn btn-primary" onclick="window.showQrCodeForReceipt()">下一步：扫码签收</button>
            </div>
        </div>
    `;
    modalContainer.classList.remove('hidden');
    modalContainer.style.display = 'flex';
};

window.showQrCodeForReceipt = () => {
    document.getElementById('qr-code-section').style.display = 'block';
    document.getElementById('loading-btn-section').style.display = 'none';
};

// --- Special Line Over-area Fee Logic ---

window.openOverAreaFeeModal = (cargoId) => {
    const cargo = window.cargoData.find(c => c.id === cargoId);
    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = `
        <div class="modal-content" style="width: 500px; background: #fff; border-radius: 16px; padding: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9;">
                <h2 style="font-size: 1.1rem; font-weight: 700;">专线超区送货费计算</h2>
                <i class="fas fa-times" style="cursor: pointer; color: #94a3b8;" onclick="document.getElementById('modal-container').classList.add('hidden')"></i>
            </div>
            
            <div style="background: #f0f9ff; padding: 16px; border-radius: 12px; margin-bottom: 20px;">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                    <i class="fas fa-map-marker-alt" style="color: #0ea5e9;"></i>
                    <div>
                        <p style="font-size: 0.75rem; color: #64748b;">收货地址</p>
                        <p style="font-size: 0.9rem; font-weight: 600;">${cargo.route.split(' -> ')[1]}</p>
                    </div>
                </div>
                <div class="form-group">
                    <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;">对应中转站</label>
                    <select id="transit-station" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px;" onchange="window.calculateDistance()">
                        <option value="">请选择中转站</option>
                        <option value="station1">嘉兴南湖中转站 (距目的地12km)</option>
                        <option value="station2">上海松江分拨中心 (距目的地45km)</option>
                        <option value="station3">无锡新区集散地 (距目的地68km)</option>
                    </select>
                </div>
            </div>

            <div id="distance-result" style="display:none; padding: 16px; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-size: 0.9rem; color: #64748b;">计算距离:</span>
                    <b id="calc-distance" style="font-size: 1.1rem; color: #1e293b;">-- km</b>
                </div>
                <div id="fee-notice" style="display: none; align-items: flex-start; gap: 8px; background: #fff7ed; padding: 10px; border-radius: 8px; margin-top: 12px;">
                    <i class="fas fa-exclamation-triangle" style="color: #f97316; margin-top: 2px;"></i>
                    <p style="font-size: 0.8rem; color: #c2410c;">检测到距离超过30公里，系统判定加收超区送货费。</p>
                </div>
            </div>

            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                 <button class="btn" onclick="document.getElementById('modal-container').classList.add('hidden')" style="background: #f1f5f9; color: #64748b;">取消</button>
                 <button class="btn btn-primary" id="apply-fee-btn" style="opacity: 0.5; pointer-events: none;" onclick="window.applyOverAreaFee('${cargoId}')">确认加收费用</button>
            </div>
        </div>
    `;
    modalContainer.classList.remove('hidden');
    modalContainer.style.display = 'flex';
};

window.calculateDistance = () => {
    const station = document.getElementById('transit-station').value;
    const resultDiv = document.getElementById('distance-result');
    const distanceText = document.getElementById('calc-distance');
    const notice = document.getElementById('fee-notice');
    const btn = document.getElementById('apply-fee-btn');

    if (!station) {
        resultDiv.style.display = 'none';
        return;
    }

    resultDiv.style.display = 'block';
    let distance = 0;
    if (station === 'station1') distance = 12;
    if (station === 'station2') distance = 45;
    if (station === 'station3') distance = 68;

    distanceText.innerText = `${distance} km`;

    if (distance > 30) {
        notice.style.display = 'flex';
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
        btn.innerText = '确认加收费用';
    } else {
        notice.style.display = 'none';
        btn.style.opacity = '0.5';
        btn.style.pointerEvents = 'none';
        btn.innerText = '距离在正常范围内';
    }
};

window.applyOverAreaFee = (cargoId) => {
    const cargo = window.cargoData.find(c => c.id === cargoId);
    if (cargo) {
        let amount = typeof cargo.amount === 'string' ? parseFloat(cargo.amount.replace(/[^0-9.]/g, '')) : cargo.amount;
        cargo.amount = (amount + 150).toFixed(2);
        refreshCargoManagement();
        document.getElementById('modal-container').classList.add('hidden');
        showToast('已根据地图测距成功加收超区送货费 ¥150');
    }
};

window.completeScanReceipt = (cargoId) => {
    const cargo = window.cargoData.find(c => c.id === cargoId);
    if (cargo) {
        cargo.status = 'received';
        cargo.statusText = '待回单';
        refreshCargoManagement();
        document.getElementById('modal-container').classList.add('hidden');
        showToast('收货方扫码成功，货物已签收');
    }
};

const renderPlaceholder = (container, viewId) => {
    container.innerHTML = `
        <div class="page-header">
            <div class="page-title">
                <h1>${viewId.charAt(0).toUpperCase() + viewId.slice(1).replace('-', ' ')}</h1>
                <p>此模块功能正在开发中...</p>
            </div>
        </div>
        <div class="card" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 100px;">
            <i class="fas fa-tools" style="font-size: 4rem; color: #f1f5f9; margin-bottom: 20px;"></i>
            <h2 style="color: var(--text-muted);">建设中</h2>
            <p style="color: var(--text-muted);">根据脑图，此部分将包含 <b>${viewId}</b> 相关的功能逻辑。</p>
        </div>
    `;
};
// --- Receipt Management View ---

const renderReceiptManagement = (container) => {
    // Filter out data that has receipts (loading status and beyond)
    const receiptData = window.cargoData.filter(item => item.status !== 'published' && item.status !== 'dispatched');

    container.innerHTML = `
        <div class="page-header">
            <div class="page-title">
                <h1>回单管理</h1>
                <p>收货人签收凭据管理，支持电子审核与纸质回单确认。</p>
            </div>
        </div>

        <div class="dashboard-grid">
            <div class="stat-card">
                <div class="stat-icon" style="background: #e0f2fe; color: #0369a1;"><i class="fas fa-file-invoice"></i></div>
                <div class="stat-label">待电子审核</div>
                <div class="stat-value">5 <span class="trend-badge trend-up">需处理</span></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background: #fef9c3; color: #854d0e;"><i class="fas fa-envelope-open-text"></i></div>
                <div class="stat-label">待纸质收回</div>
                <div class="stat-value">12 <span class="trend-badge trend-up">跟进中</span></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background: #dcfce7; color: #15803d;"><i class="fas fa-check-double"></i></div>
                <div class="stat-label">今日已完结</div>
                <div class="stat-value">28</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background: #f1f5f9; color: #64748b;"><i class="fas fa-history"></i></div>
                <div class="stat-label">月度合规率</div>
                <div class="stat-value">99.4%</div>
            </div>
        </div>

        <div class="card">
            <div class="filter-tab-container">
                <div class="filter-tab active" data-filter="all">全部</div>
                <div class="filter-tab" data-filter="pending-e">待电子审核</div>
                <div class="filter-tab" data-filter="pending-p">待纸质收回</div>
                <div class="filter-tab" data-filter="completed">已完结</div>
            </div>

            <table class="data-table">
                <thead>
                    <tr>
                        <th style="width: 140px;">货单号</th>
                        <th>装货地 / 卸货地</th>
                        <th>客户 / 货物信息</th>
                        <th>电子回单</th>
                        <th>纸质回单</th>
                        <th style="width: 100px;">审核状态</th>
                        <th style="width: 150px;">操作</th>
                    </tr>
                </thead>
                <tbody id="receipt-table-body">
                    ${renderReceiptRows(receiptData)}
                </tbody>
            </table>
        </div>
    `;

    // Filter Logic
    container.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            container.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            const filter = e.target.getAttribute('data-filter');
            // Simplified mock filtering for demonstration
            document.getElementById('receipt-table-body').innerHTML = renderReceiptRows(receiptData);
        });
    });
};

const renderReceiptRows = (data) => {
    if (data.length === 0) return `<tr><td colspan="6" style="text-align:center; padding:20px;">暂无回单数据</td></tr>`;

    return data.slice(0, 8).map(item => {
        const eStatus = ['reviewed', 'returned', 'received'].includes(item.status) ? '已上传' : '未上传';
        const pStatus = item.status === 'reviewed' ? '已收回' : '寄送中';
        const pBadge = pStatus === '已收回' ? 'status-active' : 'status-pending';

        return `
            <tr>
                <td><b style="color:var(--primary-color)">${item.id}</b></td>
                <td><div style="font-weight:600">${item.route}</div></td>
                <td>
                    <div style="font-weight:600">${item.client}</div>
                    <div style="font-size:0.75rem; color:#64748b">${item.cargo} / ${item.amount}</div>
                </td>
                <td>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <i class="fas fa-image" style="color:var(--primary-color); cursor:pointer;" onclick="window.previewReceipt('${item.id}')"></i>
                        <span style="font-size:0.85rem">${eStatus}</span>
                    </div>
                </td>
                <td>
                    <span class="status-chip ${pBadge}" style="font-size:0.75rem">${pStatus}</span>
                </td>
                <td>
                    <span class="status-chip status-active" style="display:${item.status === 'reviewed' ? 'inline-block' : 'none'}">审核通过</span>
                    <span class="status-chip status-transit" style="display:${item.status !== 'reviewed' ? 'inline-block' : 'none'}">系统待核</span>
                </td>
                <td>
                    <div style="display:flex; gap:4px;">
                        <button class="btn" style="padding: 4px 10px; font-size: 0.8rem; border:1px solid #ddd;" onclick="window.openReceiptDetailModal('${item.id}')">详情</button>
                        ${item.status === 'received' ? `<button class="btn btn-primary" style="padding: 4px 10px; font-size: 0.8rem;" onclick="window.approveReceipt('${item.id}')">审核</button>` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
};

window.openReceiptDetailModal = (id) => {
    const cargo = window.cargoData.find(c => c.id === id) || window.cargoData[0];
    const modalContainer = document.getElementById('modal-container');

    modalContainer.innerHTML = `
        <div class="modal-content" style="width: 900px; max-width: 95vw; background: #fff; border-radius: 16px; padding: 0; overflow: hidden; display: flex; flex-direction: column; max-height: 90vh;">
            <!-- Modal Header -->
            <div style="padding: 20px 24px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; background: #fff; position: sticky; top: 0; z-index: 10;">
                <div>
                    <h2 style="font-size: 1.25rem; font-weight: 700; color: #1e293b; margin: 0;">回单详情 - ${cargo.id}</h2>
                    <p style="font-size: 0.85rem; color: #64748b; margin: 4px 0 0 0;">最后更新：${cargo.actualArrival || cargo.date}</p>
                </div>
                <div style="display: flex; gap: 12px; align-items: center;">
                    <span class="status-chip status-active" style="padding: 6px 16px; font-size: 0.85rem;">已确认</span>
                    <i class="fas fa-times" style="cursor: pointer; color: #94a3b8; font-size: 1.25rem; padding: 4px;" onclick="document.getElementById('modal-container').classList.add('hidden')"></i>
                </div>
            </div>

            <!-- Modal Body (Scrollable) -->
            <div style="padding: 24px; overflow-y: auto; flex: 1; background: #f8fafc;">
                <!-- 1. 基础信息层 -->
                <div style="background: #fff; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9;">
                        <i class="fas fa-info-circle" style="color: var(--primary-color);"></i>
                        <h3 style="font-size: 1rem; font-weight: 700; margin: 0;">基础信息层</h3>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">托运单号/运单号</label>
                            <span style="font-weight: 600;">${cargo.id}</span>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">发货方名称</label>
                            <span style="font-weight: 600;">${cargo.client}</span>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">发货联系人</label>
                            <span style="font-weight: 600;">${cargo.contact || '张经理'} (${cargo.phone || '135****8888'})</span>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">收货方名称</label>
                            <span style="font-weight: 600;">${cargo.receiver || '某某仓储物流有限公司'}</span>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">收货联系人</label>
                            <span style="font-weight: 600;">${cargo.receiverContact || '王主管'} (${cargo.receiverPhone || '138****9999'})</span>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">货物信息</label>
                            <span style="font-weight: 600;">${cargo.cargo} / ${cargo.specs || 'N/A'} / ${cargo.amount}</span>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">重量/体积</label>
                            <span style="font-weight: 600;">${cargo.weight || '5.2 吨'} / ${cargo.volume || '12 m³'}</span>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">包装方式/件数</label>
                            <span style="font-weight: 600;">托盘 / ${cargo.amount}</span>
                        </div>
                    </div>
                </div>

                <!-- 2. 运输信息层 -->
                <div style="background: #fff; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9;">
                        <i class="fas fa-truck" style="color: var(--primary-color);"></i>
                        <h3 style="font-size: 1rem; font-weight: 700; margin: 0;">运输信息层</h3>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">车牌号</label>
                            <span style="font-weight: 600;">广A·6688X</span>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">司机姓名/电话</label>
                            <span style="font-weight: 600;">${cargo.driver || '王师傅'} (${cargo.driverPhone || '137****6666'})</span>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">承运公司名称</label>
                            <span style="font-weight: 600;">${cargo.fleet || '丰源车队'}</span>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">装货时间/地点</label>
                            <span style="font-weight: 600;">${cargo.date} / ${cargo.route.split(' ')[0]}</span>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">要求送达时间</label>
                            <span style="font-weight: 600;">${cargo.date} 18:00</span>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">实际送达时间</label>
                            <span style="font-weight: 600;">${cargo.actualArrival || '2026-01-11 14:20'}</span>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">运输里程 (实际/计费)</label>
                            <span style="font-weight: 600;">${cargo.mileage || '420km / 450km'}</span>
                        </div>
                    </div>
                </div>

                <!-- 3. 签收信息层 -->
                <div style="background: #fff; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9;">
                        <i class="fas fa-signature" style="color: var(--primary-color);"></i>
                        <h3 style="font-size: 1rem; font-weight: 700; margin: 0;">签收信息层</h3>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">收货方签收</label>
                            <span style="font-weight: 600;">已签名/已盖章</span>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">签收时间</label>
                            <span style="font-weight: 600;">${cargo.signTime || '2026-01-11 14:35'}</span>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">签收人身份证/工号</label>
                            <span style="font-weight: 600;">440************02X</span>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">签收状态</label>
                            <span class="status-chip status-active" style="font-size: 0.75rem;">正常签收</span>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">异常备注</label>
                            <span style="color: #64748b; font-style: italic;">无异常情况</span>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">司机确认</label>
                            <span style="color: #15803d; font-weight: 600;"><i class="fas fa-check-circle"></i> 司机已签字确认</span>
                        </div>
                    </div>
                </div>

                <!-- 4. 附加信息层 -->
                <div style="background: #fff; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9;">
                        <i class="fas fa-paperclip" style="color: var(--primary-color);"></i>
                        <h3 style="font-size: 1rem; font-weight: 700; margin: 0;">附加信息层</h3>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 20px;">
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">回单编号</label>
                            <span style="font-weight: 600;">${cargo.receiptSn || 'RC20260111-088'}</span>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">回单状态</label>
                            <span style="font-weight: 600; color: var(--primary-color);">已确认</span>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">创建/上传/确认时间</label>
                            <div style="font-size: 0.85rem; line-height: 1.6;">
                                创：2026-01-11 09:00<br>
                                传：2026-01-11 15:00<br>
                                确：2026-01-11 16:30
                            </div>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 8px;">电子签名</label>
                            <div style="width: 100%; height: 120px; background: #f1f5f9; border-radius: 8px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; border: 1px solid #e2e8f0;">
                                <i class="fas fa-pen-nib" style="font-size: 2rem; color: #cbd5e1;"></i>
                                <span style="position: absolute; bottom: 8px; font-size: 0.7rem; color: #94a3b8;">电子签名已加密存证</span>
                            </div>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 8px;">地理位置</label>
                            <div style="width: 100%; height: 120px; background: #e0f2fe; border-radius: 8px; display: flex; align-items: center; justify-content: center; position: relative; padding: 12px; border: 1px solid #bae6fd;">
                                <div style="text-align: center;">
                                    <i class="fas fa-location-dot" style="font-size: 1.5rem; color: #0284c7; margin-bottom: 8px;"></i>
                                    <p style="font-size: 0.75rem; color: #0369a1; margin: 0;">广东省深圳市南山区<br>软件产业基地 2栋</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 8px;">现场照片</label>
                            <div style="width: 100%; height: 120px; background: #f1f5f9; border-radius: 8px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; cursor: pointer; border: 1px solid #e2e8f0;">
                                <i class="fas fa-camera" style="font-size: 2rem; color: #cbd5e1;"></i>
                                <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.5); color: #fff; font-size: 0.7rem; padding: 4px; text-align: center;">查看照片</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Footer -->
            <div style="padding: 16px 24px; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; gap: 12px; background: #fff;">
                <button class="btn" style="padding: 10px 24px; border: 1px solid #e2e8f0;" onclick="document.getElementById('modal-container').classList.add('hidden')">关闭窗口</button>
                <button class="btn btn-primary" style="padding: 10px 24px;" onclick="window.printReceipt('${cargo.id}')"><i class="fas fa-print"></i> 打印回单</button>
            </div>
        </div>
    `;
    modalContainer.classList.remove('hidden');
    modalContainer.style.display = 'flex';
};

window.printReceipt = (id) => {
    showToast(`正在生成回单预览并调起打印机... (单号：${id})`);
};

window.approveReceipt = (id) => {
    const cargo = window.cargoData.find(c => c.id === id);
    if (cargo) {
        cargo.status = 'returned';
        cargo.statusText = '待评价';
        switchView('receipt-management');
        showToast('电子回单审核通过');
    }
};

window.confirmPaperReceipt = (id) => {
    const cargo = window.cargoData.find(c => c.id === id);
    if (cargo) {
        cargo.status = 'reviewed';
        cargo.statusText = '已完成';
        switchView('receipt-management');
        showToast('纸质回单已收回，订单已完结');
    }
};
