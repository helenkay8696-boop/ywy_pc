/**
 * Shipper Management System - Core Logic
 */

// Global navigation helper
window.navigateTo = (viewName, params = {}) => {
    const viewContainer = document.getElementById('view-container');

    if (viewName === 'cargoDetail') {
        window.renderCargoDetailPage(viewContainer, params.id, params);
    } else if (viewName === 'waybillDetail') {
        window.renderWaybillDetailPage(viewContainer, params.id, params);
    } else if (viewName === 'contractDetail') {
        window.renderContractDetailPage(viewContainer, params.id, params);
    } else if (viewName === 'cargoList') {
        window.renderCargoManagement2(viewContainer);
    } else if (viewName === 'waybillList') {
        window.switchView('order-status');
    } else {
        window.switchView(viewName);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

const checkLoginStatus = () => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const loginContainer = document.getElementById('login-container');
    const appContainer = document.querySelector('.app-container');

    if (isLoggedIn) {
        if (loginContainer) loginContainer.classList.add('hidden');
        if (appContainer) appContainer.classList.remove('hidden');
        return true;
    } else {
        if (loginContainer) loginContainer.classList.remove('hidden');
        if (appContainer) appContainer.classList.add('hidden');
        return false;
    }
};

const handleLogin = (e) => {
    e.preventDefault();
    const loginBtn = document.getElementById('login-btn');
    const originalContent = loginBtn.innerHTML;

    // Simulate loading
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>正在验证...</span>';

    setTimeout(() => {
        sessionStorage.setItem('isLoggedIn', 'true');
        const loginContainer = document.getElementById('login-container');
        const appContainer = document.querySelector('.app-container');

        loginContainer.classList.add('fade-out');
        setTimeout(() => {
            loginContainer.classList.add('hidden');
            loginContainer.classList.remove('fade-out');
            appContainer.classList.remove('hidden');
            appContainer.classList.add('fade-in');

            loginBtn.disabled = false;
            loginBtn.innerHTML = originalContent;

            // Show dashboard
            window.switchView('dashboard');

            // Show welcome toast
            window.showToast?.('欢迎回来，管理员！', 'success');
        }, 500);
    }, 1200);
};

window.handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    const loginContainer = document.getElementById('login-container');
    const appContainer = document.querySelector('.app-container');

    appContainer.classList.add('fade-out');
    setTimeout(() => {
        appContainer.classList.add('hidden');
        appContainer.classList.remove('fade-out');
        loginContainer.classList.remove('hidden');
        loginContainer.classList.add('fade-in');

        // Reset form
        document.getElementById('login-form')?.reset();
    }, 500);
};

const initApp = () => {
    // Always init login form listeners (so they work after logout)
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.removeEventListener('submit', handleLogin); // Prevent duplicates
        loginForm.addEventListener('submit', handleLogin);
    }

    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    if (togglePassword && passwordInput) {
        // Clone to remove old listeners if any, or just ensure single binding
        const newToggle = togglePassword.cloneNode(true);
        togglePassword.parentNode.replaceChild(newToggle, togglePassword);

        newToggle.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            newToggle.classList.toggle('fa-eye');
            newToggle.classList.toggle('fa-eye-slash');
        });
    }

    const navItems = document.querySelectorAll('.nav-item');
    const viewContainer = document.getElementById('view-container');

    // Navigation Click Handler
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const view = item.getAttribute('data-view');
            const isSubItem = item.classList.contains('nav-sub-item');

            // Handle sub-menu toggle
            if (item.classList.contains('has-sub')) {
                const subMenu = item.nextElementSibling;
                if (subMenu && subMenu.classList.contains('nav-sub')) {
                    item.classList.toggle('expanded');
                    subMenu.classList.toggle('visible');
                }
            }

            if (view) {
                switchView(view);

                // Active state handling
                navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                // If it's a sub-item, make sure its parent is also visually marked or stays expanded
                if (isSubItem) {
                    const parentMenu = item.closest('.nav-sub');
                    if (parentMenu) {
                        const parentLink = parentMenu.previousElementSibling;
                        if (parentLink && parentLink.classList.contains('has-sub')) {
                            // Highlighting the parent too (optional, but requested for clarity)
                            parentLink.classList.add('active');
                            parentLink.classList.add('expanded');
                            parentMenu.classList.add('visible');
                        }
                    }
                }
            }
        });
    });

    // Default View (only if logged in)
    if (checkLoginStatus()) {
        switchView('dashboard');
    }

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

    // Initialize Address Data
    if (!window.addressData) {
        window.addressData = [
            { id: 1, alias: '广州1号仓', contact: '张三', phone: '138****8888', province: '广东省', city: '广州市', district: '天河区', address: '元岗路100号', type: 'shipper' },
            { id: 2, alias: '上海研发中心', contact: '李四', phone: '139****9999', province: '上海市', city: '上海市', district: '浦东新区', address: '张江路500号', type: 'shipper' },
            { id: 3, alias: '深圳总部企划', contact: '王五', phone: '137****7777', province: '广东省', city: '深圳市', district: '南山区', address: '高新科技园', type: 'receiver' },
            { id: 4, alias: '武汉物流园', contact: '赵六', phone: '136****6666', province: '湖北省', city: '武汉市', district: '江夏区', address: '大桥新区', type: 'receiver' }
        ];
    }

    // Initialize Goods Data
    if (!window.goodsData) {
        window.goodsData = [
            { id: 1, name: '配件零件', packaging: '吨包', weight: '5', volume: '12', isKg: false, dimL: '1.2', dimW: '1.0', dimH: '0.8', isCommon: true },
            { id: 2, name: '食品饮料', packaging: '纸箱', weight: '2', volume: '5', isKg: false, dimL: '0.4', dimW: '0.3', dimH: '0.3', isCommon: true },
            { id: 3, name: '电子产品', packaging: '托盘', weight: '800', volume: '2', isKg: true, dimL: '1.1', dimW: '1.1', dimH: '1.5', isCommon: false }
        ];
    }

    // Initialize Auth Data
    if (!window.authData) {
        window.authData = {
            shipper: {
                realName: '',
                idCard: '',
                phone: '13800138000',
                idCardFront: null,
                idCardBack: null,
                status: 'unverified' // unverified, pending, verified
            },
            enterprise: {
                companyName: '',
                licensePhoto: null,
                taxPoint: '0.0',
                status: 'unverified'
            }
        };
    }

    // Quick Action Handler
    // Quick Action Handler
    const quickPublishBtn = document.getElementById('btn-quick-publish');
    if (quickPublishBtn) {
        quickPublishBtn.addEventListener('click', () => {
            window.openPublishCargoModal();
        });
    }
};

// Initialize Cargo Data 2 (Mock Data for all states)
if (!window.cargoData2) {
    window.cargoData2 = [
        { id: 'CG2512298376', start: '深圳', end: '北京', customer: '腾讯科技\n服务器设备', quantity: '500 台', time: '2025-12-30', status: '未接单', statusText: '未接单', actions: ['查看', '取消'] },
        { id: 'CG2512298377', start: '东莞', end: '上海', customer: '华为终端\n手机配件', quantity: '2000 件', time: '2025-12-31\n张三 (顺丰车队)', status: '已接单', statusText: '已接单', actions: ['查看', '取消'] },
        { id: 'CG2512298378', start: '西安', end: '深圳', customer: '比亚迪汽车\n汽车零部件', quantity: '15 吨', time: '2026-01-02\n李四 (顺丰车队)', status: '待评价', statusText: '待评价', actions: ['查看', '评价司机'] },
        { id: 'CG2512298379', start: '深圳', end: '成都', customer: '大疆创新\n无人机组件', quantity: '300 箱', time: '2026-01-05', status: '未接单', statusText: '未接单', actions: ['详情', '取消'] },
        {
            id: 'CG2512298401',
            start: '北京',
            end: '广州',
            customer: '小米科技\n智能家居',
            quantity: '1200 件',
            time: '2026-01-03',
            status: '运输中',
            statusText: '运输中',
            actions: ['查看', '查看轨迹'],
            waybills: [
                { id: 'YD2512298401-1', status: '运输中', statusText: '运输中', driver: '赵五', fleet: '中通物流', plate: '粤B·12345', quantity: '600 件', time: '2026-01-03 10:00' },
                { id: 'YD2512298401-2', status: '已签收', statusText: '已签收', driver: '钱八', fleet: '中通物流', plate: '粤B·67890', quantity: '600 件', time: '2026-01-03 12:00' }
            ]
        },
        {
            id: 'CG2512298402',
            start: '合肥',
            end: '武汉',
            customer: '联想集团\n笔记本电脑',
            quantity: '800 台',
            time: '2026-01-04',
            status: '已签收',
            statusText: '已签收',
            actions: ['查看', '查看轨迹'],
            waybills: [
                { id: 'YD2512298402-1', status: '已签收', statusText: '已签收', driver: '孙六', fleet: '德邦快递', plate: '鄂A·11223', quantity: '400 台', time: '2026-01-04 09:00' },
                { id: 'YD2512298402-2', status: '已签收', statusText: '已签收', driver: '李九', fleet: '德邦快递', plate: '鄂A·33445', quantity: '400 台', time: '2026-01-04 09:30' }
            ]
        },
        { id: 'CG2512298403', start: '上海', end: '杭州', customer: '特斯拉\n电池组件', quantity: '5 吨', time: '-', status: '草稿', statusText: '草稿', actions: ['详情', '发布', '删除'] },
        { id: 'CG2512298404', start: '武汉', end: '长沙', customer: '京东物流\n日用百货', quantity: '1000 箱', time: '-', status: '未接单', statusText: '未接单', actions: ['详情', '取消'] },
        { id: 'CG2512298405', start: '广州', end: '南宁', customer: '美的电器\n空调', quantity: '200 台', time: '2026-01-01\n王七 (货拉拉)', status: '已接单', statusText: '已接单', actions: ['查看', '取消'] },
        { id: 'CG2512298406', start: '重庆', end: '贵阳', customer: '长安汽车\n配件', quantity: '10 吨', time: '2026-01-02', status: '已电子回单', statusText: '已电子回单', actions: ['查看', '查看回单'] },
        { id: 'CG2512298407', start: '天津', end: '沈阳', customer: '一汽大众\n配件', quantity: '5 吨', time: '2026-01-03', status: '已纸质回单', statusText: '已纸质回单', actions: ['查看', '查看回单', '结算'] },
        { id: 'CG2512298408', start: '青岛', end: '济南', customer: '海尔智家\n洗衣机', quantity: '300 台', time: '2026-01-04', status: '已结算', statusText: '已结算', actions: ['查看'] },
        { id: 'CG2512298409', start: '南京', end: '苏州', customer: '苏宁易购\n电器', quantity: '500 件', time: '2026-01-05', status: '已完成', statusText: '已完成', actions: ['查看', '评价', '再来一单'] },
        { id: 'CG2512298410', start: '厦门', end: '福州', customer: '安踏体育\n鞋服', quantity: '200 箱', time: '-', status: '已取消', statusText: '已取消', actions: ['查看', '恢复'] },
        { id: 'CG2512298411', start: '郑州', end: '洛阳', customer: '宇通客车\n配件', quantity: '8 吨', time: '-', status: '回收站', statusText: '回收站', actions: ['恢复', '彻底删除'] },
        { id: 'CG2512298412', start: '昆明', end: '大理', customer: '云南白药\n药品', quantity: '100 箱', time: '2026-01-06', status: '异常运单', statusText: '异常运单', actions: ['查看', '删除', '处理异常'] }
    ];
}


// Initialize Contract Data
if (!window.contractData) {
    window.contractData = [
        { id: 'CON-2025001', name: '2025年度物流运输服务主合同', type: '长期合同', signer: '丰源物流有限公司', date: '2025-01-01', expireDate: '2025-12-31', status: 'active', statusText: '生效中', actions: ['详情', '预览', '下载'] },
        { id: 'CON-2024098', name: '2024Q4补充协议', type: '补充协议', signer: '丰源物流有限公司', date: '2024-10-15', expireDate: '2024-12-31', status: 'active', statusText: '生效中', actions: ['详情', '预览', '下载'] },
        { id: 'CON-2024001', name: '2024年度物流运输服务主合同', type: '长期合同', signer: '丰源物流有限公司', date: '2024-01-01', expireDate: '2024-12-31', status: 'expired', statusText: '已过期', actions: ['详情', '预览'] }
    ];
}

// Initialize After-sales Data
if (!window.afterSalesData) {
    window.afterSalesData = [
        { id: '#AS-102', orderId: '#ORD-8821', type: '货物破损', status: 'pending', statusText: '处理中', time: '2025-12-23 09:00', description: '货物外包装严重变形，内部产品受损。', result: '' },
        { id: '#AS-103', orderId: '#ORD-9022', type: '运费争议', status: 'pending', statusText: '待协商', time: '2025-12-24 11:30', description: '实际路程比预估多出20公里，司机要求额外补偿。', result: '' },
        { id: '#AS-101', orderId: '#ORD-8750', type: '运输时效延迟', status: 'processed', statusText: '已结案', time: '2025-12-21 14:20', description: '受极端天气影响导致到货延迟1天。', result: '已与货主达成延时补偿方案。' },
        { id: '#AS-100', orderId: '#ORD-8600', type: '货物丢失', status: 'processed', statusText: '已赔付', time: '2025-12-18 09:00', description: '转运过程中遗失一箱高价值零件。', result: '全额赔付完成。' }
    ];
}

// Initialize Wallet Data
if (!window.walletData) {
    window.walletData = {
        balance: 12580.00,
        transactions: [
            { id: 1, type: 'recharge', title: '账户充值', time: '2025-01-05 14:30', amount: 5000.00, status: 'success' },
            { id: 2, type: 'withdraw', title: '余额提现', time: '2025-01-03 09:15', amount: -2000.00, status: 'success' },
            { id: 3, type: 'expend', title: '运费支付 - #ORD-8821', time: '2025-01-02 18:20', amount: -1200.00, status: 'success' },
            { id: 4, type: 'recharge', title: '账户充值', time: '2025-01-01 10:00', amount: 10000.00, status: 'success' }
        ],
        bankCards: [
            { id: 1, bankName: '招商银行', cardNumber: '8888', cardType: '储蓄卡' },
            { id: 2, bankName: '中国工商银行', cardNumber: '6666', cardType: '储蓄卡' }
        ]
    };
}

window.switchView = async (viewId) => {
    const container = document.getElementById('view-container');
    window.currentView = viewId;

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
            case 'cargo-management-2':
                window.renderCargoManagement2(container);
                break;
            case 'base-data':
                renderBaseData(container);
                break;
            case 'address-management':
                renderAddressManagement(container);
                break;
            case 'goods-management':
                renderGoodsManagement(container);
                break;
            case 'auth-center':
                renderAuthCenter(container);
                break;
            case 'contract-management':
                renderContractManagement(container);
                break;
            case 'business-config':
                renderBusinessConfig(container);
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
            case 'consignor-recharge':
                renderConsignorRecharge(container);
                break;
            default:
                renderPlaceholder(container, viewId);
        }
    }, 400);
};

window.viewOrderTrack = (orderId) => {
    const trackPoints = window.orderTrackData[orderId] || [];
    const modalContainer = document.getElementById('modal-container');

    modalContainer.innerHTML = `
        <div class="modal-content" style="width: 1000px; max-width: 95vw; background: #fff; border-radius: 16px; padding: 0; overflow: hidden; height: 80vh; display: flex; flex-direction: column;">
            <div style="padding: 20px 24px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
                <div>
                   <h2 style="font-size: 1.25rem; font-weight: 700; color: #1e293b;">运单轨迹 - ${orderId}</h2>
                   <p style="font-size: 0.85rem; color: #64748b; margin-top: 4px;">车辆实时位置与运输时间线</p>
                </div>
                <button class="btn" onclick="document.getElementById('modal-container').classList.add('hidden')" style="padding: 8px 16px; background: #f1f5f9; color: #64748b; border-radius: 8px;">关闭</button>
            </div>
            
            <div style="flex: 1; display: flex; overflow: hidden;">
                <!-- Timeline Section -->
                <div style="width: 350px; border-right: 1px solid #f1f5f9; overflow-y: auto; padding: 24px; background: #fafbfc;">
                    <div style="margin-bottom: 20px; font-weight: 700; color: #1e293b; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-clock" style="color: #4f46e5;"></i> 运输时间线
                    </div>
                    
                    ${trackPoints.length > 0 ? trackPoints.map((point, index) => `
                        <div style="display: flex; gap: 16px; position: relative; padding-bottom: 30px;">
                            ${index !== trackPoints.length - 1 ? `<div style="position: absolute; left: 7px; top: 20px; bottom: 0; width: 2px; background: #e2e8f0;"></div>` : ''}
                            <div style="width: 16px; height: 16px; border-radius: 50%; background: ${index === 0 ? '#4f46e5' : '#e2e8f0'}; border: 3px solid #fff; box-shadow: 0 0 0 1px ${index === 0 ? '#4f46e5' : '#e2e8f0'}; z-index: 1; margin-top: 4px;"></div>
                            <div>
                                <div style="font-weight: 700; color: ${index === 0 ? '#1e293b' : '#64748b'}; font-size: 0.95rem;">${point.status}</div>
                                <div style="font-size: 0.8rem; color: #94a3b8; margin: 4px 0;">${point.time}</div>
                                <div style="font-weight: 600; color: #334155; font-size: 0.85rem; margin-bottom: 4px;">${point.location}</div>
                                <div style="font-size: 0.85rem; color: #64748b; line-height: 1.4;">${point.desc}</div>
                            </div>
                        </div>
                    `).join('') : '<div style="color:#94a3b8; text-align:center; padding-top:40px;">暂无轨迹数据</div>'}
                </div>
                
                <!-- Map Section -->
                <div style="flex: 1; position: relative; background: #f0f4f8; overflow: hidden;">
                    <!-- Professional Mock Map Background -->
                    <div style="position: absolute; inset: 0; background: 
                        linear-gradient(#e5e7eb 1px, transparent 1px),
                        linear-gradient(90deg, #e5e7eb 1px, transparent 1px);
                        background-size: 40px 40px; background-color: #f3f4f6;">
                    </div>
                    
                    <!-- SVG Route Drawing -->
                    <svg style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none;">
                        <path d="M 100 400 Q 300 350 500 200 T 800 100" fill="none" stroke="#4f46e5" stroke-width="4" stroke-dasharray="8,4" opacity="0.4" />
                        <path d="M 100 400 Q 300 350 400 275" fill="none" stroke="#4f46e5" stroke-width="4" />
                        
                        <!-- Pulse effect for vehicle -->
                        <circle cx="400" cy="275" r="12" fill="#4f46e5" opacity="0.2">
                            <animate attributeName="r" values="12;20;12" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="400" cy="275" r="6" fill="#4f46e5" />
                    </svg>
                    
                    <!-- Map Overlays -->
                    <div style="position: absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.9); padding: 12px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); font-size: 0.85rem; width: 180px;">
                        <div style="font-weight: 700; margin-bottom: 8px; color: #1e293b;">车辆状态</div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                            <span style="color: #64748b;">速度</span>
                            <span style="font-weight: 600;">68 km/h</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                            <span style="color: #64748b;">预计到达</span>
                            <span style="font-weight: 600; color: #4f46e5;">3.5 小时</span>
                        </div>
                        <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e2e8f0; color: #10b981; font-weight: 700;">
                            <i class="fas fa-check-circle"></i> 行驶状态正常
                        </div>
                    </div>
                    
                    <!-- Labels -->
                    <div style="position: absolute; left: 80px; top: 410px; text-align: center;">
                        <div style="background: white; padding: 4px 8px; border-radius: 4px; font-weight: 700; font-size: 0.75rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">广州市</div>
                    </div>
                    <div style="position: absolute; left: 380px; top: 240px; text-align: center;">
                        <div style="background: #4f46e5; color: white; padding: 6px 12px; border-radius: 10px; font-weight: 700; font-size: 0.85rem; box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);">
                            <i class="fas fa-truck"></i> 粤A·88888
                        </div>
                    </div>
                    <div style="position: absolute; left: 780px; top: 80px; text-align: center;">
                        <div style="background: white; padding: 4px 8px; border-radius: 4px; font-weight: 700; font-size: 0.75rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">上海市</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    modalContainer.classList.remove('hidden');
    modalContainer.style.display = 'flex';
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
    // Initialize global waybill data if not exists
    if (!window.waybillData) {
        window.waybillData = [
            { id: '#ORD-9021', route: '广州天河区 → 上海浦东新区', driver: '王师傅 (9.6米厢式)', status: 'transit', statusText: '运输中', detail: '距终点145km', eta: '今日 18:00', actions: ['track'], plate: '粤B·90211', quantity: '1200件', freight: 1200 },
            { id: '#ORD-9018', route: '中山火炬 → 常州武进', driver: '李师傅 (13米平板)', status: 'transit', statusText: '运输中', detail: '已进入江浙', eta: '明天 09:30', actions: ['track'], plate: '粤B·90188', quantity: '800件', freight: 2500 },
            { id: '#ORD-9022', route: '深圳南山 → 北京朝阳', driver: '未接单', status: 'pending', statusText: '未接单', detail: '等待司机接单', eta: '-', actions: ['cancel'], plate: '-', quantity: '-', freight: 1500 },
            { id: '#ORD-9023', route: '佛山南海 → 长沙雨花', driver: '张师傅 (4.2米)', status: 'accepted', statusText: '已接单', detail: '司机前往装货地', eta: '明日 10:00', actions: [], plate: '粤A·90233', quantity: '500件', freight: 800 },
            { id: '#ORD-9015', route: '东莞松山湖 → 武汉江夏', driver: '陈师傅 (6.8米)', status: 'signed', statusText: '已签收', detail: '电子回单待上传', eta: '已送达', actions: ['track', 'rate'], plate: '粤S·90155', quantity: '300箱', freight: 600 },
            { id: '#ORD-9012', route: '珠海高新 → 杭州西湖', driver: '刘师傅 (9.6米)', status: 'returned', statusText: '已回单', detail: '回单审核中', eta: '已送达', actions: ['view_receipt'], plate: '粤C·90122', quantity: '15吨', freight: 3000 },
            { id: '#ORD-9008', route: '惠州仲恺 → 南京江宁', driver: '赵师傅 (13米)', status: 'settled', statusText: '已结算', detail: '运费已支付', eta: '已送达', actions: ['view_settlement'], plate: '粤L·90088', quantity: '1200件', freight: 2000 },
            { id: '#ORD-9005', route: '江门蓬江 → 成都双流', driver: '-', status: 'cancelled', statusText: '已取消', detail: '货主主动取消', eta: '-', actions: [], plate: '-', quantity: '-', freight: 0 },
        ];
    }
    const mockOrders = window.waybillData.filter(item =>
        !['pending', 'accepted', 'settled', 'cancelled'].includes(item.status)
    );

    container.innerHTML = `
        <div class="page-header">
            <div class="page-title">
                <h1>运单管理</h1>
                <p>全流程管理运单状态，支持新建、跟踪及异常处理。</p>
            </div>

        </div>
        
        <div class="card">
            <!-- Filter Inputs -->
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; padding: 16px; margin: 0 16px 16px 16px; background: #f8fafc; border-radius: 8px;">
                <input type="text" placeholder="运单号/客户" style="padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
                <input type="text" placeholder="出发城市" style="padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
                <input type="text" placeholder="到达城市" style="padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
                 <input type="date" style="padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
            </div>

            <!-- Filter Bar -->
            <div style="margin-bottom: 24px; display: flex; gap: 8px; flex-wrap: wrap;">
                <button class="btn filter-btn active" data-filter="all" style="background: var(--primary-color); color: white;">全部</button>
                <button class="btn filter-btn" data-filter="transit" style="background: #f1f5f9; color: var(--text-main);">运输中</button>
                <button class="btn filter-btn" data-filter="signed" style="background: #f1f5f9; color: var(--text-main);">已签收</button>
                <button class="btn filter-btn" data-filter="returned" style="background: #f1f5f9; color: var(--text-main);">已回单</button>
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
            if (action === 'track') actionButtons += `<button class="btn btn-primary" style="padding: 4px 10px; font-size: 0.8rem;" onclick="window.viewOrderTrack('${order.id}')">查看轨迹</button>`;
            if (action === 'modify') actionButtons += `<button class="btn" style="padding: 4px 10px; font-size: 0.8rem; border:1px solid #ddd;">修改</button>`;
            if (action === 'cancel') actionButtons += `<button class="btn" style="padding: 4px 10px; font-size: 0.8rem; color: var(--danger-color); border:1px solid #fee2e2;" onclick="window.cancelWaybill('${order.id}')">取消</button>`;
            if (action === 'rate') actionButtons += `<button class="btn" style="padding: 4px 10px; font-size: 0.8rem; border:1px solid var(--warning-color); color: var(--warning-color);">评价</button>`;
            if (action === 'view_receipt') actionButtons += `<button class="btn" style="padding: 4px 10px; font-size: 0.8rem; color: var(--primary-color); border:1px solid #e0f2fe;">查看回单</button>`;
            if (action === 'view_settlement') actionButtons += `<button class="btn" style="padding: 4px 10px; font-size: 0.8rem; border:1px solid #ddd;">查看支付</button>`;
        });

        // Special styling for Cancelled
        const statusStyle = order.status === 'cancelled' ? 'background:#f3f4f6; color:#9ca3af;' : '';
        const detailText = order.status === 'transit' ? order.detail : `<span style="color:#64748b">${order.detail}</span>`;

        return `
            <tr onclick="window.navigateTo('waybillDetail', {id: '${order.id}', from: 'waybillList'})" style="cursor: pointer; border-bottom: 1px solid #f1f5f9; transition: background 0.2s;" onmouseover="this.style.background='#f8fbff'" onmouseout="this.style.background='transparent'">
                <td style="font-family: monospace; color: #5345ec; font-weight: 600;">${order.id}</td>
                <td><div style="font-weight: 600;">${order.route}</div></td>
                <td>
                    <div>${order.driver}</div>
                    <div style="font-size: 0.8rem; color: #64748b;">${order.plate || ''}</div>
                </td>
                <td><span class="status-chip ${statusClass}" style="white-space: nowrap; ${statusStyle}">${order.statusText}</span></td>
                <td>${order.eta}<br><span style="font-size:0.75rem">${detailText}</span></td>
                <td onclick="event.stopPropagation()">
                    <div style="display: flex; align-items: center; gap: 8px;">
                     <button class="btn-text" style="color: #4f46e5; font-weight: 600;" onclick="window.navigateTo('waybillDetail', {id: '${order.id}', from: 'waybillList'})">详情</button>
                    ${actionButtons}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
};

window.cancelWaybill = (id) => {
    if (confirm('是否确认取消该运单？取消后将无法恢复。')) {
        const order = window.waybillData.find(o => o.id === id);
        if (order) {
            order.status = 'cancelled';
            order.statusText = '已取消';
            order.actions = [];
            order.detail = '货主主动取消';
            // Refresh view
            const container = document.getElementById('view-container');
            renderOrderStatus(container);
            showToast('运单已取消');
        }
    }
};

window.renderCargoManagement2 = (container) => {
    // Use Global Data (Growth Version)
    const displayData = window.cargoData2;

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
            // Use cargoData2 for filtering
            const filteredData = filter === 'all' ? window.cargoData2 : window.cargoData2.filter(item => item.status === filter);
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

window.openPublishCargoModal = (mode = 'new', id = null) => {
    let item = null;
    if (id) {
        item = (window.cargoData2 || []).find(it => it.id === id) || (window.cargoData || []).find(it => it.id === id);
    }

    // Default to the first waybill or the item itself if no sub-waybills
    // If 'mode' contains a selected waybill ID (e.g. 'view:YD001'), parse it.
    let selectedWaybillId = null;
    if (mode.startsWith('view:') || mode.startsWith('detail:')) {
        const parts = mode.split(':');
        mode = parts[0];
        selectedWaybillId = parts[1];
    }

    const currentWaybill = (item?.waybills && item.waybills.length > 0)
        ? (selectedWaybillId ? item.waybills.find(w => w.id === selectedWaybillId) : item.waybills[0])
        : item;

    // Helper to switch waybill view
    window.switchWaybillView = (waybillId) => {
        window.openPublishCargoModal(`view:${waybillId}`, item.id);
    };

    const modalContainer = document.getElementById('modal-container');
    const isView = mode === 'view';
    const isEdit = mode === 'edit';
    const isReorder = mode === 'reorder';

    // Extract info from item if present
    const clientName = item ? (item.customer ? item.customer.split('\n')[0] : (item.client || '')) : '';
    const cargoName = item ? (item.customer ? item.customer.split('\n')[1] : (item.cargo || '')) : '';
    const loadingPlace = item ? item.start || item.route?.split('→')[0].trim() || '' : '';
    const unloadingPlace = item ? item.end || item.route?.split('→')[1].trim() || '' : '';
    const quantityStr = item ? item.quantity || item.amount || '' : '';
    const qtyValue = quantityStr ? parseInt(quantityStr) : '';
    const qtyUnit = quantityStr ? quantityStr.replace(/[0-9\s]/g, '') : '吨';
    const arrivalTime = item ? (item.time ? item.time.split('\n')[0] : item.date) : '';

    modalContainer.innerHTML = `
        <div class="modal-content" style="width: 800px; max-width: 95vw; background: #fff; border-radius: 16px; display: flex; flex-direction: column; max-height: 90vh; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
            <div style="padding: 24px 24px 16px; flex-shrink: 0; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9;">
                <h2 style="font-size: 1.25rem; font-weight: 700; color: #1e293b; margin: 0;">${isView ? '查看货单' : (isEdit ? '修改货单' : (isReorder ? '发布货单 (再来一单)' : '发布货单'))}</h2>
                <div style="display: flex; gap: 12px;">
                     <button class="btn" onclick="document.getElementById('modal-container').classList.add('hidden')" style="background: #f1f5f9; color: #64748b;">${isView ? '关闭' : '取消'}</button>
                     ${!isView ? `
                        <button class="btn" onclick="showToast('草稿已保存')" style="background: #eef2ff; color: #5345ec; border: none; font-weight: 600;">保存草稿</button>
                        <button class="btn btn-primary" onclick="submitNewCargo()">${isEdit ? '保存修改' : '发布'}</button>
                     ` : ''}
                     ${(isView && (mode === 'detail')) ? `<button class="btn btn-primary" onclick="window.openPublishCargoModal('edit', '${item.id}')">修改</button>` : ''}
                </div>
            </div>
            
            <div style="padding: 24px; overflow-y: auto; flex: 1;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="form-group" style="grid-column: span 1;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;">运输单号</label>
                    <input type="text" value="${(isReorder || !item) ? 'CG' + Date.now().toString().slice(-10) : item.id}" readonly style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; color: #94a3b8;">
                </div>
                <div class="form-group" style="grid-column: span 1;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;"><span style="color:red">*</span>客户名称</label>
                    <input type="text" id="input-client-name" placeholder="请输入客户名称" value="${clientName}" ${isView ? 'disabled' : ''} style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; ${isView ? 'background:#f8fafc;' : ''}">
                </div>

                <div class="form-group" style="grid-column: span 1;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;"><span style="color:red">*</span>装货地</label>
                    <div style="position: relative;">
                            <input type="text" id="input-loading-place" placeholder="请选择装货地" value="${loadingPlace}" readonly ${!isView ? "onclick=\"openMapModal('input-loading-place')\"" : ''} style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; cursor: ${isView ? 'default' : 'pointer'}; background: ${isView ? '#f8fafc' : 'white'};">
                            ${!isView ? '<i class="fas fa-chevron-down" style="position: absolute; right: 10px; top: 12px; color: #94a3b8; pointer-events: none;"></i>' : ''}
                    </div>
                </div>
                <div class="form-group" style="grid-column: span 1;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;"><span style="color:red">*</span>卸货地</label>
                    <div style="position: relative;">
                            <input type="text" id="input-unloading-place" placeholder="请选择卸货地" value="${unloadingPlace}" readonly ${!isView ? "onclick=\"openMapModal('input-unloading-place')\"" : ''} style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; cursor: ${isView ? 'default' : 'pointer'}; background: ${isView ? '#f8fafc' : 'white'};">
                            ${!isView ? '<i class="fas fa-chevron-down" style="position: absolute; right: 10px; top: 12px; color: #94a3b8; pointer-events: none;"></i>' : ''}
                    </div>
                </div>

                <div class="form-group" style="grid-column: span 1;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;"><span style="color:red">*</span>货物名称</label>
                        <select id="input-cargo-name" ${isView ? 'disabled' : ''} style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; color: #64748b; background:${isView ? '#f8fafc' : 'white'};">
                            <option value="">请选择货物名称</option>
                            <option ${cargoName === '电子产品' || cargoName === '服务器设备' ? 'selected' : ''}>电子产品</option>
                            <option ${cargoName === '普通百货' || cargoName === '手机配件' ? 'selected' : ''}>普通百货</option>
                            <option ${cargoName === '汽车零部件' ? 'selected' : ''}>汽车零部件</option>
                        </select>
                </div>
                <div class="form-group" style="grid-column: span 1;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;"><span style="color:red">*</span>货物数量</label>
                    <div style="display: flex; gap: 8px;">
                            <input type="text" id="input-cargo-qty" placeholder="请输入数量" value="${qtyValue}" ${isView ? 'disabled' : ''} style="flex: 1; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; ${isView ? 'background:#f8fafc;' : ''}">
                            <select id="input-cargo-unit" ${isView ? 'disabled' : ''} style="width: 80px; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; color: #1e293b; background:${isView ? '#f8fafc' : 'white'};">
                                <option ${qtyUnit === '吨' ? 'selected' : ''}>吨</option>
                                <option ${qtyUnit === '方' ? 'selected' : ''}>方</option>
                                <option ${qtyUnit === '件' ? 'selected' : ''}>件</option>
                                <option ${qtyUnit === '台' ? 'selected' : ''}>台</option>
                            </select>
                    </div>
                </div>

                <div class="form-group" style="grid-column: span 1;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;"><span style="color:red">*</span>约定到达时间</label>
                        <input type="datetime-local" id="input-arrival-time" value="${arrivalTime}" ${isView ? 'disabled' : ''} style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; color: #1e293b; background:${isView ? '#f8fafc' : 'white'};">
                </div>
                <div class="form-group" style="grid-column: span 1;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;">约定送达时间</label>
                        <input type="datetime-local" ${isView ? 'disabled' : ''} style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; color: #1e293b; background:${isView ? '#f8fafc' : 'white'};">
                </div>

                <div class="form-group" style="grid-column: span 2;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;"><span style="color:red">*</span>运输凭证</label>
                        <select ${isView ? 'disabled' : ''} style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; color: #1e293b; background:${isView ? '#f8fafc' : 'white'};">
                            <option>出库单加回单</option>
                        </select>
                </div>
                
                <div class="form-group" style="grid-column: span 2;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;">服务要求</label>
                    <textarea placeholder="请输入内容" ${isView ? 'disabled' : ''} style="width: 100%; height: 80px; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; resize: none; ${isView ? 'background:#f8fafc;' : ''}"></textarea>
                </div>

                    <div class="form-group" style="grid-column: span 2;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;">备注</label>
                    <textarea placeholder="请输入内容" ${isView ? 'disabled' : ''} style="width: 100%; height: 80px; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; resize: none; ${isView ? 'background:#f8fafc;' : ''}"></textarea>
                </div>

                ${(isView && (['已接单', '运输中', '已签收', '待评价', '已完成', '已电子回单', '已纸质回单'].includes(item?.statusText) || ['已接单', '运输中', '已签收', '待评价', '已完成'].includes(item?.status))) ? `
                
                ${item.waybills && item.waybills.length > 0 ? `
                <div style="grid-column: span 2; margin-top: 10px; padding-top: 20px; border-top: 1px dashed #e2e8f0;">
                    <h3 style="font-size: 1rem; font-weight: 700; color: #1e293b; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-layer-group" style="color: #6366f1;"></i> 关联运单列表
                    </h3>
                    <div style="display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px;">
                        ${item.waybills.map(wb => `
                            <div onclick="window.switchWaybillView('${wb.id}')" 
                                 style="flex-shrink: 0; min-width: 160px; padding: 12px; border-radius: 8px; border: 1px solid ${wb.id === currentWaybill.id ? '#4f46e5' : '#e2e8f0'}; background: ${wb.id === currentWaybill.id ? '#eef2ff' : '#fff'}; cursor: pointer; transition: all 0.2s;">
                                <div style="font-weight: 600; color: ${wb.id === currentWaybill.id ? '#4f46e5' : '#334155'}; font-size: 0.9rem; margin-bottom: 4px;">${wb.id}</div>
                                <div style="font-size: 0.8rem; color: #64748b;">${wb.statusText} · ${wb.driver}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <div style="grid-column: span 2; margin-top: 10px; padding-top: 20px; border-top: 1px dashed #e2e8f0;">
                    <h3 style="font-size: 1rem; font-weight: 700; color: #1e293b; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-id-card" style="color: #5345ec;"></i> 接单信息 ${item.waybills && item.waybills.length > 0 ? `<span style="font-size:0.8rem; font-weight:400; color:#64748b; margin-left:auto;">当前查看: ${currentWaybill.id}</span>` : ''}
                    </h3>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; background: #f8fbff; padding: 16px; border-radius: 12px; border: 1px solid #e0e7ff;">
                        ${(item.statusText === '运输中') ? `
                        <div style="grid-column: span 3; font-weight:700; color:#1e293b; margin-bottom: 8px;">运输中信息</div>
                        ` : ''}
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">接单司机</label>
                            <span style="font-weight: 600; color: #1e293b;">${currentWaybill.driver || currentWaybill.time?.split('\n')[1]?.split('(')[0]?.trim() || '刘师傅'}</span>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">承运车队</label>
                            <span style="font-weight: 600; color: #1e293b;">${currentWaybill.fleet || currentWaybill.time?.split('(')[1]?.replace(')', '')?.trim() || '自营车队'}</span>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">车牌号</label>
                            <span style="font-weight: 600; color: #1e293b;">${currentWaybill.plate || ('粤B·' + currentWaybill.id.slice(-5))}</span>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">接单时间</label>
                            <span style="font-weight: 600; color: #1e293b;">${(currentWaybill.time && currentWaybill.time.includes('\n')) ? currentWaybill.time.split('\n')[0] : (currentWaybill.time || '2026-01-04 10:30')}</span>
                    </div>
                </div>
            </div>
                ` : ''}
            
            ${(isView && (currentWaybill?.statusText === '运输中' || currentWaybill?.statusText === '已签收' || currentWaybill?.statusText === '待评价' || currentWaybill?.statusText === '已完成')) ? `
            <div style="margin-top: 10px; padding-top: 20px; border-top: 1px dashed #e2e8f0; padding-left: 24px; padding-right: 24px;" id="modal-track-container">
                <!-- Tracking Timeline will be rendered here -->
            </div>
            ` : ''}
            
            ${(isView && (currentWaybill?.statusText === '已签收' || currentWaybill?.statusText === '待评价' || currentWaybill?.statusText === '已完成')) ? `
            <div style="margin-top: 10px; padding-top: 20px; border-top: 1px dashed #e2e8f0; padding-left: 24px; padding-right: 24px;">
                <h3 style="font-size: 1rem; font-weight: 700; color: #1e293b; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-file-signature" style="color: #10b981;"></i> 签收相关信息
                </h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; background: #ecfdf5; padding: 16px; border-radius: 12px; border: 1px solid #d1fae5;">
                    <div><label style="display:block;font-size:0.8rem;color:#059669;margin-bottom:4px">签收人</label><span style="font-weight:600;color:#065f46">张三</span></div>
                    <div><label style="display:block;font-size:0.8rem;color:#059669;margin-bottom:4px">签收时间</label><span style="font-weight:600;color:#065f46">2026-01-05 14:00</span></div>
                </div>
            </div>
            ` : ''}

            ${(isView && (currentWaybill?.statusText === '待评价' || currentWaybill?.statusText === '已完成')) ? `
            <div style="margin-top: 10px; padding-top: 20px; border-top: 1px dashed #e2e8f0; padding-left: 24px; padding-right: 24px;">
                <h3 style="font-size: 1rem; font-weight: 700; color: #1e293b; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-file-invoice-dollar" style="color: #f59e0b;"></i> 结算信息
                </h3>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; background: #fffbeb; padding: 16px; border-radius: 12px; border: 1px solid #fcd34d;">
                    <div><label style="display:block;font-size:0.8rem;color:#b45309;margin-bottom:4px">结算金额</label><span style="font-weight:700;color:#b45309;font-size:1.1rem;">¥2,350.00</span></div>
                    <div><label style="display:block;font-size:0.8rem;color:#b45309;margin-bottom:4px">支付状态</label><span style="font-weight:600;color:#059669"><i class="fas fa-check-circle"></i> 已支付</span></div>
                    <div><label style="display:block;font-size:0.8rem;color:#b45309;margin-bottom:4px">支付时间</label><span style="font-weight:600;color:#b45309">2026-01-05 15:30</span></div>
                </div>
            </div>
            ` : ''}

            ${(isView && currentWaybill?.statusText === '已完成') ? `
            <div style="margin-top: 10px; padding-top: 20px; border-top: 1px dashed #e2e8f0; padding-left: 24px; padding-right: 24px;">
                <h3 style="font-size: 1rem; font-weight: 700; color: #1e293b; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-star" style="color: #f59e0b;"></i> 评价信息
                </h3>
                <div style="background: #fafbfc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0;">
                    <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                        <span style="font-weight:600; color:#334155;">综合评分:</span>
                        <div style="color: #f59e0b; font-size: 1rem;"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                    </div>
                    <div style="font-size: 0.9rem; color: #64748b; line-height: 1.5;">
                        司机服务态度很好，运输速度也很快，货物完好无损，非常满意！
                    </div>
                </div>
            </div>
            ` : ''}
            <div style="height: 24px;"></div> 
            <!-- Spacer for bottom padding -->
            </div>
        </div>
    </div>
    `;
    modalContainer.classList.remove('hidden');
    modalContainer.style.display = 'flex';
    // Render track inside modal if container exists
    if (isView && ['运输中', '已签收', '待评价', '已完成'].includes(currentWaybill?.statusText)) {
        const trackContainer = document.getElementById('modal-track-container');
        if (trackContainer && window.renderTrackTimeline) {
            // Mock track points based on currentWaybill or use default
            const trackPoints = window.orderTrackData[currentWaybill.id] || window.orderTrackData['#ORD-9021'];
            window.renderTrackTimeline(trackContainer, trackPoints);
        }
    }
};

// Helper for rendering horizontal tracking timeline
window.renderTrackTimeline = (container, trackPoints) => {
    if (!trackPoints || trackPoints.length === 0) {
        container.innerHTML = '<div style="color:#94a3b8; text-align:center; padding: 20px;">暂无轨迹数据</div>';
        return;
    }

    container.innerHTML = `
        <div style="font-weight: 700; color: #1e293b; display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
            <i class="fas fa-route" style="color: #4f46e5;"></i> 物流轨迹信息
        </div>
        <div style="background: #fafbfc; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; max-height: 300px; overflow-y: auto;">
            ${trackPoints.map((point, index) => `
                <div style="display: flex; gap: 16px; position: relative; padding-bottom: 24px;">
                    ${index !== trackPoints.length - 1 ? `<div style="position: absolute; left: 7px; top: 20px; bottom: 0; width: 2px; background: #e2e8f0;"></div>` : ''}
                    <div style="width: 16px; height: 16px; border-radius: 50%; background: ${index === 0 ? '#4f46e5' : '#e2e8f0'}; border: 3px solid #fff; box-shadow: 0 0 0 1px ${index === 0 ? '#4f46e5' : '#e2e8f0'}; z-index: 1; flex-shrink: 0; margin-top: 4px;"></div>
                    <div>
                        <div style="font-weight: 700; color: ${index === 0 ? '#1e293b' : '#64748b'}; font-size: 0.95rem;">${point.status} <span style="font-weight: 400; font-size: 0.8rem; margin-left: 8px; color: #94a3b8;">${point.time}</span></div>
                        <div style="font-weight: 600; color: #334155; font-size: 0.85rem; margin: 4px 0;">${point.location}</div>
                        <div style="font-size: 0.85rem; color: #64748b; line-height: 1.4;">${point.desc}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
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
        route: `${loadPlace.split(' ')[0]} <i class="fas fa-arrow-right"></i> ${unloadPlace.split(' ')[0]} `,
        cargo: cargoName,
        amount: `${qty} ${unit} `,
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

const renderAddressManagement = (container) => {
    container.innerHTML = `
        <div class="page-header" style="margin-bottom: 24px;">
            <div class="page-title">
                <h1>常用地址管理</h1>
                <p>管理您的发货人及收货人地址薄。</p>
            </div>
        </div>

        <div class="base-module" id="address-module" style="border: none; box-shadow: none; background: transparent; overflow: visible;">
            <div style="margin-bottom: 20px;">
                <div class="module-title" style="margin-bottom: 16px;">
                    <div class="module-icon bg-blue-soft" style="background: transparent; color: #1e293b; padding: 0; width: auto; height: auto;"><i class="fas fa-map-marked-alt" style="font-size: 1.2rem;"></i></div>
                    <h3 style="font-size: 1.1rem; font-weight: 700;">常用地址列表</h3>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; gap: 12px; align-items: center;">
                        <button class="addr-type-tab active" data-type="shipper">常用发货地</button>
                        <button class="addr-type-tab" data-type="receiver">常用收货地</button>
                        <button class="btn btn-primary" id="add-address-btn" onclick="window.openAddressModal(null)" style="padding: 10px 20px; border-radius: 8px; font-weight: 500;">
                            <i class="fas fa-plus"></i> 新增地址
                        </button>
                    </div>
                    <div class="search-box" style="position: relative; width: 280px;">
                        <i class="fas fa-search" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8;"></i>
                        <input type="text" id="addr-search-input" placeholder="搜索别名、联系人或电话..."
                            style="width: 100%; padding: 10px 10px 10px 36px; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; transition: border 0.2s;">
                    </div>
                </div>
            </div>

            <div class="card" style="border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: var(--shadow-sm);">
                <div class="module-body" id="address-list-container" style="padding: 0;"></div>
            </div>
        </div>
    `;

    const addrListContainer = document.getElementById('address-list-container');
    const searchInput = document.getElementById('addr-search-input');
    let currentType = 'shipper';

    const updateAddressList = () => {
        // Restore: Explicitly update the button's onclick to pass the current type
        // This ensures the modal opens with the correct type context (e.g. shipper vs receiver)
        if (addAddrBtn) {
            addAddrBtn.setAttribute('onclick', `window.openAddressModal(null, '${currentType}')`);
        }
        const query = searchInput.value.trim().toLowerCase();
        renderAddressListTable(addrListContainer, currentType, query);
    };

    const addrTabs = container.querySelectorAll('.addr-type-tab');
    addrTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            addrTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentType = tab.getAttribute('data-type');
            updateAddressList();
        });
    });

    searchInput.addEventListener('input', updateAddressList);

    updateAddressList();
};

const renderGoodsManagement = (container) => {
    container.innerHTML = `
        <div class="page-header" style="margin-bottom: 24px;">
            <div class="page-title">
                <h1>货物信息管理</h1>
                <p>管理您的常用货物信息，提升发货效率。</p>
            </div>
        </div>

        <div class="base-module" id="goods-module" style="border: none; box-shadow: none; background: transparent; overflow: visible;">
            <div style="margin-bottom: 20px;">
                <div class="module-title" style="margin-bottom: 16px;">
                    <div class="module-icon bg-orange-soft" style="background: transparent; color: #1e293b; padding: 0; width: auto; height: auto;"><i class="fas fa-box-open" style="font-size: 1.2rem;"></i></div>
                    <h3 style="font-size: 1.1rem; font-weight: 700;">货物信息列表</h3>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <button class="btn btn-primary" onclick="window.openGoodsModal(null)" style="padding: 10px 20px; border-radius: 8px; font-weight: 500;">
                        <i class="fas fa-plus"></i> 新增货物
                    </button>
                    <div class="search-box" style="position: relative; width: 280px;">
                        <i class="fas fa-search" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8;"></i>
                        <input type="text" id="goods-search-input" placeholder="搜索货物名称或包装方式..."
                            style="width: 100%; padding: 10px 10px 10px 36px; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; transition: border 0.2s;">
                    </div>
                </div>
            </div>

            <div class="card" style="border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: var(--shadow-sm);">
                <div class="module-body" id="goods-list-container" style="padding: 0;"></div>
            </div>
        </div>
    `;

    const goodsListContainer = document.getElementById('goods-list-container');
    const searchInput = document.getElementById('goods-search-input');

    const updateGoodsList = () => {
        const query = searchInput.value.trim().toLowerCase();
        renderGoodsListTable(goodsListContainer, query);
    };

    searchInput.addEventListener('input', updateGoodsList);

    renderGoodsListTable(goodsListContainer);
};

const renderBaseData = (container) => {
    container.innerHTML = `
        <div class="page-header">
            <div class="page-title">
                <h1>基础数据管理</h1>
                <p>管理您的用户信息、地址薄及常用货物信息。</p>
            </div>
        </div>
        
        <!-- Module 1: Address Management -->
        <div class="base-module" id="address-module">
            <div class="module-header">
                <div class="module-title">
                    <div class="module-icon bg-blue-soft"><i class="fas fa-map-marked-alt"></i></div>
                    <h3>常用地址管理</h3>
                </div>
                <div style="display: flex; gap: 16px; align-items: center;">
                    <div class="filter-tab-container" style="margin-bottom: 0; padding-bottom: 0;">
                        <button class="filter-tab active" data-type="shipper">常用发货地</button>
                        <button class="filter-tab" data-type="receiver">常用收货地</button>
                    </div>
                    <button class="btn btn-primary" id="add-address-btn" style="padding: 8px 16px;">
                        <i class="fas fa-plus"></i> 新增地址
                    </button>
                </div>
            </div>
            <div class="module-body" id="address-list-container">
                <!-- Address table rendered here -->
            </div>
        </div>

        <!-- Module 2: Goods Management -->
        <div class="base-module" id="goods-module">
            <div class="module-header">
                <div class="module-title">
                    <div class="module-icon bg-orange-soft"><i class="fas fa-box-open"></i></div>
                    <h3>货物信息管理</h3>
                </div>
                <button class="btn btn-primary" onclick="window.openGoodsModal(null)" style="padding: 8px 16px;">
                    <i class="fas fa-plus"></i> 新增货物
                </button>
            </div>
            <div class="module-body" id="goods-list-container">
                <!-- Goods table rendered here -->
            </div>
        </div>
    `;

    // Initialize Address Module
    let currentAddrType = 'shipper';
    const addrListContainer = document.getElementById('address-list-container');
    const addAddrBtn = document.getElementById('add-address-btn');

    const updateAddressList = (type) => {
        currentAddrType = type;
        addAddrBtn.setAttribute('onclick', `window.openAddressModal(null, '${type}')`);
        renderAddressListTable(addrListContainer, type);
    };

    // Address Tab Interaction
    const addrTabs = container.querySelectorAll('#address-module .filter-tab');
    addrTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            addrTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            updateAddressList(tab.getAttribute('data-type'));
        });
    });

    // Initialize Goods Module
    const goodsListContainer = document.getElementById('goods-list-container');
    renderGoodsListTable(goodsListContainer);

    // Initial load
    updateAddressList('shipper');
};


const renderGoodsListTable = (container, query = '') => {
    let data = window.goodsData || [];

    if (query) {
        data = data.filter(item =>
            (item.name && item.name.toLowerCase().includes(query)) ||
            (item.packaging && item.packaging.toLowerCase().includes(query))
        );
    }

    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 80px; text-align: center; padding-left: 24px;">常用</th>
                    <th>货物名称</th>
                    <th>包装方式</th>
                    <th>重量/体积</th>
                    <th>参考尺寸 (m)</th>
                    <th style="text-align: right; padding-right: 24px;">操作</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(item => `
                    <tr class="hover-row">
                        <td style="text-align: center; padding-left: 24px;">
                            <i class="${item.isCommon ? 'fas fa-star' : 'far fa-star'}" 
                                style="color: ${item.isCommon ? '#f59e0b' : '#cbd5e1'}; cursor: pointer; font-size: 1.1rem;"
                                onclick="window.toggleCommonGoods(${item.id})"></i>
                        </td>
                        <td><span style="font-weight: 600; color: var(--text-main)">${item.name}</span></td>
                        <td><span class="status-chip" style="background: #f1f5f9; color: #475569; font-weight: 500;">${item.packaging}</span></td>
                        <td>
                            <div style="font-weight: 500; color: var(--text-main)">${item.weight}${item.isKg ? 'kg' : '吨'}</div>
                            <div style="font-size: 0.75rem; color: #94a3b8;">${item.volume || 0}方</div>
                        </td>
                        <td><span class="text-muted" style="font-size: 0.85rem">${item.dimL || '-'}/${item.dimW || '-'}/${item.dimH || '-'}</span></td>
                        <td style="text-align: right; padding-right: 24px;">
                            <button class="btn-text" style="color: #6366f1; font-weight: 600; margin-right: 8px;" onclick="window.openGoodsModal('${item.id}')">编辑</button>
                            <button class="btn-text" style="color: var(--danger-color); font-weight: 600;" onclick="window.deleteGoods('${item.id}')">删除</button>
                        </td>
                    </tr>
                `).join('')}
                ${data.length === 0 ? `<tr><td colspan="6" style="text-align:center; padding: 60px; color: var(--text-muted)">
                    <div style="display:flex; flex-direction:column; align-items:center; gap:12px;">
                        <i class="fas fa-box-open" style="font-size: 2rem; opacity: 0.3;"></i>
                        <span>${query ? '未找到匹配的货物' : '暂无货物信息'}</span>
                    </div>
                </td></tr>` : ''}
            </tbody>
        </table>
        `;
};

const renderAuthCenter = (container) => {
    const auth = window.authData;
    container.innerHTML = `
        <div class="page-header" style="margin-bottom: 24px;">
            <div class="page-title">
                <h1>认证中心</h1>
                <p>完成资质认证，开启更高权限的服务体验。</p>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
            <!-- Shipper Certification -->
            <div class="card" style="padding: 24px; border-radius: 16px;">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
                    <div class="module-icon" style="background: rgba(79, 70, 229, 0.1); color: var(--primary-color);">
                        <i class="fas fa-user-shield"></i>
                    </div>
                    <div>
                        <h3 style="margin: 0; font-size: 1.1rem; font-weight: 700;">发货人认证</h3>
                        <p style="margin: 0; font-size: 0.8rem; color: #64748b;">个人实名认证及身份证上传</p>
                    </div>
                    <span class="status-chip ${auth.shipper.status === 'verified' ? 'status-active' : 'status-pending'}"
                        style="margin-left: auto;">
                        ${auth.shipper.status === 'verified' ? '已认证' : (auth.shipper.status === 'pending' ? '审核中' : '未认证')}
                    </span>
                </div>

                <div class="form-group" style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">手机号</label>
                    <input type="text" id="shipper-phone" class="form-input" value="${auth.shipper.phone}" placeholder="请输入手机号">
                </div>
                <div class="form-group" style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">身份证号</label>
                    <input type="text" id="shipper-idcard" class="form-input" value="${auth.shipper.idCard}" placeholder="请输入18位身份证号">
                </div>
                <div class="form-group" style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">身份证正反面</label>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <!-- Front -->
                        <div style="border: 2px dashed #e2e8f0; border-radius: 12px; padding: 16px; text-align: center; cursor: pointer; transition: all 0.2s;"
                            onclick="document.getElementById('id-front-upload').click()">
                            <div style="height: 100px; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #f8fafc; border-radius: 8px;">
                                ${auth.shipper.idCardFront ? `<img src="${auth.shipper.idCardFront}" style="width: 100%; height: 100%; object-fit: cover;">` : '<i class="fas fa-id-card" style="font-size: 2rem; color: #cbd5e1;"></i>'}
                            </div>
                            <p style="margin: 8px 0 0; font-size: 0.8rem; color: #64748b;">人像面</p>
                            <input type="file" id="id-front-upload" style="display: none;" onchange="window.handleIdCardUpload(event, 'front')">
                        </div>
                        <!-- Back -->
                        <div style="border: 2px dashed #e2e8f0; border-radius: 12px; padding: 16px; text-align: center; cursor: pointer; transition: all 0.2s;"
                            onclick="document.getElementById('id-back-upload').click()">
                            <div style="height: 100px; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #f8fafc; border-radius: 8px;">
                                ${auth.shipper.idCardBack ? `<img src="${auth.shipper.idCardBack}" style="width: 100%; height: 100%; object-fit: cover;">` : '<i class="fas fa-id-card" style="font-size: 2rem; color: #cbd5e1;"></i>'}
                            </div>
                            <p style="margin: 8px 0 0; font-size: 0.8rem; color: #64748b;">国徽面</p>
                            <input type="file" id="id-back-upload" style="display: none;" onchange="window.handleIdCardUpload(event, 'back')">
                        </div>
                    </div>
                </div>

                <button class="btn btn-primary" style="width: 100%; padding: 12px; border-radius: 10px; font-weight: 600;"
                    onclick="window.saveShipperAuth()">
                    提交个人认证
                </button>
            </div>

            <!-- Enterprise Certification -->
            <div class="card" style="padding: 24px; border-radius: 16px;">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
                    <div class="module-icon" style="background: rgba(245, 158, 11, 0.1); color: #f59e0b;">
                        <i class="fas fa-building"></i>
                    </div>
                    <div>
                        <h3 style="margin: 0; font-size: 1.1rem; font-weight: 700;">发货企业认证</h3>
                        <p style="margin: 0; font-size: 0.8rem; color: #64748b;">企业资质备案及开票税点设置</p>
                    </div>
                    <span class="status-chip ${auth.enterprise.status === 'verified' ? 'status-active' : 'status-pending'}"
                        style="margin-left: auto;">
                        ${auth.enterprise.status === 'verified' ? '已认证' : (auth.enterprise.status === 'pending' ? '审核中' : '未认证')}
                    </span>
                </div>

                <div class="form-group" style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">单位名称</label>
                    <input type="text" id="ent-name" class="form-input" value="${auth.enterprise.companyName}" placeholder="请输入营业执照上的全称">
                </div>

                <div class="form-group" style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">营业执照</label>
                    <div style="border: 2px dashed #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.2s;"
                        onmouseover="this.style.borderColor='var(--primary-color)'" onmouseout="this.style.borderColor='#e2e8f0'"
                        onclick="document.getElementById('license-upload').click()">
                        <i class="fas fa-cloud-upload-alt" style="font-size: 2rem; color: #94a3b8; margin-bottom: 8px;"></i>
                        <p style="margin: 0; font-size: 0.85rem; color: #64748b;">点击上传营业执照照片</p>
                        <input type="file" id="license-upload" style="display: none;" onchange="window.handleLicenseUpload(event)">
                            <div id="license-preview" style="margin-top: 10px; display: ${auth.enterprise.licensePhoto ? 'block' : 'none'};">
                                <img src="${auth.enterprise.licensePhoto || ''}" style="max-width: 100%; border-radius: 8px; max-height: 150px;">
                            </div>
                    </div>
                </div>

                <div class="form-group" style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">税点设置 (%)</label>
                    <input type="number" id="ent-tax" class="form-input" value="${auth.enterprise.taxPoint}" placeholder="例如：0.06">
                </div>

                <button class="btn btn-primary" style="width: 100%; padding: 12px; border-radius: 10px; font-weight: 600; background: #f59e0b; border-color: #f59e0b;"
                    onclick="window.saveEnterpriseAuth()">
                    提交企业认证
                </button>
            </div>
        </div>
    `;
};

window.saveShipperAuth = () => {
    const phone = document.getElementById('shipper-phone').value;
    const idCard = document.getElementById('shipper-idcard').value;

    if (!phone || !idCard) {
        showToast('请填写手机号和身份证号');
        return;
    }

    if (!window.authData.shipper.idCardFront || !window.authData.shipper.idCardBack) {
        showToast('请上传身份证正反面照片');
        return;
    }

    window.authData.shipper = {
        ...window.authData.shipper,
        phone, idCard, status: 'pending'
    };
    showToast('个人认证申请已提交，等待审核');
    renderAuthCenter(document.getElementById('view-container'));
};

window.handleIdCardUpload = (event, side) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (side === 'front') window.authData.shipper.idCardFront = e.target.result;
            else window.authData.shipper.idCardBack = e.target.result;
            renderAuthCenter(document.getElementById('view-container'));
        };
        reader.readAsDataURL(file);
    }
};

window.saveEnterpriseAuth = () => {
    const name = document.getElementById('ent-name').value;
    const tax = document.getElementById('ent-tax').value;

    if (!name) {
        showToast('请输入单位名称');
        return;
    }

    window.authData.enterprise = {
        ...window.authData.enterprise,
        companyName: name, taxPoint: tax, status: 'pending'
    };
    showToast('企业认证申请已提交，等待审核');
    renderAuthCenter(document.getElementById('view-container'));
};

window.handleLicenseUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            window.authData.enterprise.licensePhoto = e.target.result;
            const preview = document.getElementById('license-preview');
            preview.style.display = 'block';
            preview.querySelector('img').src = e.target.result;
            showToast('营业执照已上传');
        };
        reader.readAsDataURL(file);
    }
};

// --- Address Modal Logic ---
window.openAddressModal = (id, type) => {
    // Auto-detect type if not provided (restore original logic robustness)
    if (!type) {
        const activeTab = document.querySelector('.addr-type-tab.active') || document.querySelector('.filter-tab.active');
        type = activeTab ? activeTab.getAttribute('data-type') : 'shipper';
    }

    const isEdit = id !== null;
    const address = isEdit ? window.addressData.find(a => a.id == id) : {
        alias: '', contact: '', phone: '',
        province: '', city: '', district: '',
        address: '', type: type
    };

    const modalHtml = `
        <div class="modal-overlay" id="address-modal">
            <div class="card" style="width: 600px; max-width: 95vw; padding: 0; overflow: hidden; border-radius: 20px;">
                <div class="card-header" style="padding: 24px; background: #fff; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0; font-size: 1.25rem; font-weight: 700;">${isEdit ? '编辑' : '新增'}${type === 'shipper' ? '发货' : '收货'}地址</h3>
                    <button class="btn-text" onclick="window.closeAddressModal()" style="font-size: 1.5rem; color: #94a3b8;">&times;</button>
                </div>
                <div style="padding: 24px; max-height: 80vh; overflow-y: auto;">
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; font-size: 0.9rem; color: #1e293b;">地址别名</label>
                        <input type="text" id="addr-alias" class="form-input" value="${address.alias}" placeholder="例如：广州1号仓">
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; font-size: 0.9rem; color: #1e293b;">联系人</label>
                            <input type="text" id="addr-contact" class="form-input" value="${address.contact}" placeholder="请输入姓名">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; font-size: 0.9rem; color: #1e293b;">联系电话</label>
                            <input type="text" id="addr-phone" class="form-input" value="${address.phone}" placeholder="请输入手机号码">
                        </div>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; font-size: 0.9rem; color: #1e293b;">省 / 市 / 区</label>
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;">
                            <select id="addr-province" class="form-input"><option value="">省份</option><option value="广东省" ${address.province === '广东省' ? 'selected' : ''}>广东省</option><option value="上海市" ${address.province === '上海市' ? 'selected' : ''}>上海市</option><option value="北京市" ${address.province === '北京市' ? 'selected' : ''}>北京市</option></select>
                            <select id="addr-city" class="form-input"><option value="">城市</option><option value="广州市" ${address.city === '广州市' ? 'selected' : ''}>广州市</option><option value="上海市" ${address.city === '上海市' ? 'selected' : ''}>上海市</option><option value="深圳市" ${address.city === '深圳市' ? 'selected' : ''}>深圳市</option></select>
                            <select id="addr-district" class="form-input"><option value="">区县</option><option value="天河区" ${address.district === '天河区' ? 'selected' : ''}>天河区</option><option value="浦东新区" ${address.district === '浦东新区' ? 'selected' : ''}>浦东新区</option><option value="南山区" ${address.district === '南山区' ? 'selected' : ''}>南山区</option></select>
                        </div>
                    </div>

                    <div style="margin-bottom: 24px; position: relative;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <label style="font-weight: 600; font-size: 0.9rem; color: #1e293b;">详细地址</label>
                            <button class="btn-text" onclick="window.showMapPicker()" style="color: var(--primary-color); display: flex; align-items: center; gap: 4px; font-size: 0.85rem;">
                                <i class="fas fa-location-dot"></i> 地图选址
                            </button>
                        </div>
                        <textarea id="addr-address" class="form-input" style="height: 80px; resize: none; padding-top: 10px;" placeholder="建议填写门牌号、楼层等详细信息">${address.address}</textarea>
                    </div>

                    <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 32px;">
                        <button class="btn" style="background: #f1f5f9; color: #475569; padding: 10px 24px;" onclick="window.closeAddressModal()">取消</button>
                        <button class="btn btn-primary" style="padding: 10px 32px; background: #5345ec;" onclick="window.saveAddress(${id}, '${type}')">确认保存</button>
                    </div>
                </div>
            </div>
        </div>
        `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.closeAddressModal = () => {
    document.getElementById('address-modal')?.remove();
};

window.showMapPicker = () => {
    const mapModalHtml = `
        < div class="modal-overlay" id = "map-picker-modal" style = "z-index: 2000; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);" >
            <div class="card" style="width: 850px; max-width: 95vw; height: auto; padding: 0; overflow: hidden; border-radius: 24px; border: none; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
                <!-- Map Area -->
                <div style="height: 440px; background: #eaedf2; position: relative; display: flex; align-items: center; justify-content: center;">
                    <div style="text-align: center; color: #94a3b8;">
                        <div style="margin-bottom: 20px;">
                            <svg width="68" height="68" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.4;">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                        </div>
                        <p style="font-size: 1.1rem; font-weight: 500;">正在连接 Google Maps...</p>

                        <div style="margin-top: 32px; background: white; padding: 12px 24px; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); color: #334155; display: inline-flex; align-items: center; gap: 8px;">
                            <span style="color: #64748b; font-weight: 500;">定位标记:</span>
                            <span style="font-weight: 600;">广东省广州市天河区华夏路10号</span>
                        </div>
                    </div>

                    <!-- Top Search Bar -->
                    <div style="position: absolute; top: 24px; left: 24px; right: 24px; z-index: 10;">
                        <div style="background: white; border-radius: 16px; padding: 4px 8px; display: flex; align-items: center; box-shadow: 0 4px 20px rgba(0,0,0,0.08); height: 56px;">
                            <i class="fas fa-search" style="margin: 0 16px; color: #94a3b8; font-size: 1.1rem;"></i>
                            <input type="text" placeholder="搜索地点..." style="border: none; outline: none; width: 100%; font-size: 1rem; color: #1e293b;">
                        </div>
                    </div>

                    <!-- Recenter Button -->
                    <div style="position: absolute; bottom: 24px; right: 24px;">
                        <button style="background: white; width: 52px; height: 52px; border-radius: 12px; border: none; box-shadow: 0 4px 12px rgba(0,0,0,0.1); color: #475569; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1.3rem;">
                            <i class="fas fa-crosshairs"></i>
                        </button>
                    </div>

                    <button class="btn-text" onclick="document.getElementById('map-picker-modal').remove()" style="position: absolute; top: 24px; right: -60px; color: white; font-size: 2rem;">&times;</button>
                </div>

                <!-- List Area -->
                <div style="padding: 24px 32px; background: white;">
                    <h4 style="margin: 0 0 20px 0; font-size: 1.1rem; font-weight: 700; color: #0f172a;">周边地点</h4>
                    <div style="max-height: 220px; overflow-y: auto;">
                        <div class="map-place-item" onclick="window.selectMapPoint('广东省', '广州市', '天河区', '华夏路10号富力盈凯广场')" style="display: flex; align-items: flex-start; gap: 16px; padding: 16px 0; border-bottom: 1px solid #f1f5f9; cursor: pointer; transition: all 0.2s;">
                            <div style="color: #6366f1; background: #eef2ff; width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <i class="fas fa-location-dot"></i>
                            </div>
                            <div>
                                <div style="font-weight: 600; color: #1e293b; font-size: 1rem; margin-bottom: 4px;">富力盈凯广场</div>
                                <div style="font-size: 0.85rem; color: #64748b;">广东省广州市天河区华夏路10号</div>
                            </div>
                        </div>
                        <div class="map-place-item" onclick="window.selectMapPoint('广东省', '广州市', '天河区', '珠江东路16号高德置地广场')" style="display: flex; align-items: flex-start; gap: 16px; padding: 16px 0; border-bottom: 1px solid #f1f5f9; cursor: pointer; transition: all 0.2s;">
                            <div style="color: #94a3b8; background: #f8fafc; width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <i class="fas fa-location-dot"></i>
                            </div>
                            <div>
                                <div style="font-weight: 600; color: #1e293b; font-size: 1rem; margin-bottom: 4px;">高德置地广场</div>
                                <div style="font-size: 0.85rem; color: #64748b;">广东省广州市天河区珠江东路16号</div>
                            </div>
                        </div>
                    </div>
                    <div style="margin-top: 24px; display: flex; justify-content: flex-end;">
                        <button class="btn" style="background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; padding: 10px 24px;" onclick="document.getElementById('map-picker-modal').remove()">关闭</button>
                    </div>
                </div>
            </div>
        </div >
        <style>
            .map-place-item:hover {background: #f8fbff; padding-left: 8px; }
            #map-picker-modal::-webkit-scrollbar {width: 6px; }
            #map-place-item::-webkit-scrollbar-thumb {background: #e2e8f0; border-radius: 10px; }
        </style>
    `;
    document.body.insertAdjacentHTML('beforeend', mapModalHtml);
};

window.selectMapPoint = (p, c, d, addr) => {
    document.getElementById('addr-province').value = p;
    document.getElementById('addr-city').value = c;
    document.getElementById('addr-district').value = d;
    document.getElementById('addr-address').value = addr;

    showToast('已从地图同步地址');
    document.getElementById('map-picker-modal').remove();
};

window.saveAddress = (id, type) => {
    const alias = document.getElementById('addr-alias').value;
    const contact = document.getElementById('addr-contact').value;
    const phone = document.getElementById('addr-phone').value;
    const province = document.getElementById('addr-province').value;
    const city = document.getElementById('addr-city').value;
    const district = document.getElementById('addr-district').value;
    const address = document.getElementById('addr-address').value;

    if (!alias || !contact || !phone || !address || !province || !city || !district) {
        showToast('请填写完整地址信息（含省市区）');
        return;
    }

    if (id) {
        // Edit existing
        const index = window.addressData.findIndex(a => a.id == id);
        if (index !== -1) {
            window.addressData[index] = { id, alias, contact, phone, province, city, district, address, type };
        }
    } else {
        // Add new
        const newId = Date.now();
        window.addressData.push({ id: newId, alias, contact, phone, province, city, district, address, type });
    }

    showToast('地址保存成功');
    window.closeAddressModal();

    // Smart refresh
    const addrContainer = document.getElementById('address-list-container');
    if (addrContainer) {
        const currentType = document.querySelector('#address-module .filter-tab.active')?.getAttribute('data-type') || type;
        renderAddressListTable(addrContainer, currentType);
    } else {
        renderBaseData(document.getElementById('view-container'));
    }
};

window.deleteAddress = (id) => {
    if (confirm('确定要删除该地址吗？')) {
        const addrIndex = window.addressData.findIndex(a => a.id == id);
        const type = addrIndex !== -1 ? window.addressData[addrIndex].type : 'shipper';

        window.addressData = window.addressData.filter(a => a.id != id);
        showToast('地址已删除');

        const addrContainer = document.getElementById('address-list-container');
        if (addrContainer) {
            // Check if we are in modular view or base data view
            const activeTab = document.querySelector('.addr-type-tab.active') || document.querySelector('.filter-tab.active');
            const currentType = activeTab ? activeTab.getAttribute('data-type') : type;
            renderAddressListTable(addrContainer, currentType);
        } else {
            renderBaseData(document.getElementById('view-container'));
        }
    }
};

// --- Goods Management Logic ---
// --- Address Management Logic ---
const renderAddressListTable = (container, type, query = '') => {
    let filteredData = window.addressData.filter(addr => addr.type === type);

    if (query) {
        filteredData = filteredData.filter(item =>
            (item.alias && item.alias.toLowerCase().includes(query)) ||
            (item.contact && item.contact.toLowerCase().includes(query)) ||
            (item.phone && item.phone.includes(query)) ||
            (item.address && item.address.toLowerCase().includes(query))
        );
    }

    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th style="padding-left: 24px;">别名</th>
                    <th>联系人</th>
                    <th>电话</th>
                    <th>详细地址</th>
                    <th style="text-align: right; padding-right: 24px;">操作</th>
                </tr>
            </thead>
            <tbody>
                ${filteredData.map(item => `
                    <tr class="hover-row">
                        <td style="padding-left: 24px;"><span style="font-weight: 600; color: var(--text-main)">${item.alias}</span></td>
                        <td>${item.contact}</td>
                        <td>${item.phone}</td>
                        <td><span class="text-muted" style="font-size: 0.85rem">${item.province || ''}${item.city || ''}${item.district || ''} ${item.address}</span></td>
                        <td style="text-align: right; padding-right: 24px;">
                            <button class="btn-text" style="color: #6366f1; font-weight:600; margin-right: 8px;" onclick="window.openAddressModal('${item.id}', '${type}')">编辑</button>
                            <button class="btn-text" style="color: var(--danger-color); font-weight:600;" onclick="window.deleteAddress('${item.id}')">删除</button>
                        </td>
                    </tr>
                `).join('')}
                ${filteredData.length === 0 ? `<tr><td colspan="5" style="text-align:center; padding: 60px; color: var(--text-muted)">
                    <div style="display:flex; flex-direction:column; align-items:center; gap:12px;">
                        <i class="fas fa-search" style="font-size: 2rem; opacity: 0.3;"></i>
                        <span>${query ? '未找到匹配的地址' : '暂无此类地址数据'}</span>
                    </div>
                </td></tr>` : ''}
            </tbody>
        </table>
        `;
};

// --- Goods Management Logic ---
window.openGoodsModal = (id) => {
    // Determine edit mode: id must be present and not 'null' (string check for robustness)
    const isEdit = id !== null && id !== 'null';
    const item = isEdit ? window.goodsData.find(g => g.id == id) : {
        name: '', packaging: '吨包', weight: '', volume: '', isKg: false,
        dimL: '', dimW: '', dimH: '', isCommon: false
    };

    const modalHtml = `
        <div class="modal-overlay" id="goods-modal">
            <div class="card" style="width: 550px; border-radius: 20px; overflow: hidden; padding: 0;">
                <div class="card-header" style="padding: 24px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0; font-weight: 700;">${isEdit ? '编辑' : '新增'}货物信息</h3>
                    <button class="btn-text" onclick="window.closeGoodsModal()" style="font-size: 1.5rem;">&times;</button>
                </div>
                <div style="padding: 24px; max-height: 70vh; overflow-y: auto;">
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600;">货物名称</label>
                        <input type="text" id="goods-name" class="form-input" value="${item.name}" placeholder="如：配件零件、食品饮料">
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600;">包装方式</label>
                            <select id="goods-packaging" class="form-input">
                                ${['吨包', '散装', '袋装', '托盘', '纸箱', '其他'].map(p => `
                                    <option value="${p}" ${item.packaging === p ? 'selected' : ''}>${p}</option>
                                `).join('')}
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600;">设为常用</label>
                            <div style="display: flex; align-items: center; gap: 10px; height: 45px;">
                                <input type="checkbox" id="goods-iscommon" ${item.isCommon ? 'checked' : ''} style="width: 20px; height: 20px; cursor: pointer;">
                                    <span style="font-size: 0.9rem; color: #64748b;">在APP端优先选填</span>
                            </div>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600;">重量</label>
                            <div style="display: flex; gap: 8px;">
                                <input type="number" id="goods-weight" class="form-input" value="${item.weight}" placeholder="数值">
                                    <select id="goods-unit" class="form-input" style="width: 80px;">
                                        <option value="ton" ${!item.isKg ? 'selected' : ''}>吨</option>
                                        <option value="kg" ${item.isKg ? 'selected' : ''}>kg</option>
                                    </select>
                            </div>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600;">体积 (方)</label>
                            <input type="number" id="goods-volume" class="form-input" value="${item.volume}" placeholder="数值">
                        </div>
                    </div>

                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600;">货物规格 (L*W*H 米)</label>
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;">
                            <input type="number" id="goods-dimL" class="form-input" value="${item.dimL}" placeholder="长">
                                <input type="number" id="goods-dimW" class="form-input" value="${item.dimW}" placeholder="宽">
                                    <input type="number" id="goods-dimH" class="form-input" value="${item.dimH}" placeholder="高">
                                    </div>
                                </div>
                        </div>
                        <div style="padding: 20px 24px; background: #f8fafc; display: flex; justify-content: flex-end; gap: 12px;">
                            <button class="btn" style="background: white; border: 1px solid #e2e8f0; color: #64748b;" onclick="window.closeGoodsModal()">取消</button>
                            <button class="btn btn-primary" onclick="window.saveGoods(${id})">保存货物</button>
                        </div>
                    </div>
                </div>
                `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.closeGoodsModal = () => {
    const modal = document.getElementById('goods-modal');
    if (modal) modal.remove();
};

window.saveGoods = (id) => {
    const name = document.getElementById('goods-name').value;
    const packaging = document.getElementById('goods-packaging').value;
    const isCommon = document.getElementById('goods-iscommon').checked;
    const weight = document.getElementById('goods-weight').value;
    const volume = document.getElementById('goods-volume').value;
    const isKg = document.getElementById('goods-unit').value === 'kg';
    const dimL = document.getElementById('goods-dimL').value;
    const dimW = document.getElementById('goods-dimW').value;
    const dimH = document.getElementById('goods-dimH').value;

    if (!name) {
        showToast('请输入货物名称');
        return;
    }

    const goodsObj = {
        id: id || Date.now(),
        name, packaging, isCommon, weight, volume, isKg, dimL, dimW, dimH
    };

    if (id) {
        const index = window.goodsData.findIndex(g => g.id == id);
        if (index !== -1) window.goodsData[index] = goodsObj;
    } else {
        window.goodsData.unshift(goodsObj);
    }

    showToast('货物信息已保存');
    window.closeGoodsModal();

    const goodsContainer = document.getElementById('goods-list-container');
    if (goodsContainer) {
        renderGoodsListTable(goodsContainer);
    } else {
        renderBaseData(document.getElementById('view-container'));
        // If in base data, we might need to sync tabs
        const tabs = document.querySelectorAll('.address-tab');
        tabs.forEach(t => {
            if (t.dataset.type === 'goods') t.click();
        });
    }
};

window.deleteGoods = (id) => {
    if (confirm('确定要删除该货物信息吗？')) {
        window.goodsData = window.goodsData.filter(g => g.id != id);
        showToast('货物信息已删除');

        const goodsContainer = document.getElementById('goods-list-container');
        if (goodsContainer) {
            renderGoodsListTable(goodsContainer);
        } else {
            renderBaseData(document.getElementById('view-container'));
            const tabs = document.querySelectorAll('.address-tab');
            tabs.forEach(t => {
                if (t.dataset.type === 'goods') t.click();
            });
        }
    }
};

window.toggleCommonGoods = (id) => {
    const item = window.goodsData.find(g => g.id == id);
    if (item) {
        item.isCommon = !item.isCommon;
        showToast(item.isCommon ? '已设为常用' : '已取消常用');

        const goodsContainer = document.getElementById('goods-list-container');
        if (goodsContainer) {
            renderGoodsListTable(goodsContainer);
        } else {
            // we are in the base data view, update the list 
            const tabs = document.querySelectorAll('.address-tab');
            tabs.forEach(t => {
                if (t.classList.contains('active') && t.dataset.type === 'goods') t.click();
            });
        }
    }
};

const renderContractManagement = (container) => {
    const data = window.contractData || [];

    container.innerHTML = `
                <div class="page-header" style="margin-bottom: 24px;">
                    <div class="page-title">
                        <h1>合同管理</h1>
                        <p>查看和管理您的运输服务合同及相关协议。</p>
                    </div>
                </div>

                <div class="base-module" style="background: transparent; box-shadow: none; border: none; overflow: visible;">
                    <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                        <div class="module-title">
                            <div class="module-icon bg-blue-soft" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; width: auto; height: auto; padding: 0;">
                                <i class="fas fa-file-contract" style="font-size: 1.2rem;"></i>
                            </div>
                            <h3 style="font-size: 1.1rem; font-weight: 700;">合同列表</h3>
                        </div>
                        <div class="search-box" style="position: relative; width: 280px;">
                            <i class="fas fa-search" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8;"></i>
                            <input type="text" placeholder="搜索合同名称或编号..."
                                style="width: 100%; padding: 10px 10px 10px 36px; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; transition: border 0.2s;">
                        </div>
                    </div>

                    <div class="card" style="border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: var(--shadow-sm);">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th style="padding-left: 24px;">合同编号</th>
                                    <th>合同名称</th>
                                    <th>类型</th>
                                    <th>签署日期</th>
                                    <th>合同到期日期</th>
                                    <th>状态</th>
                                    <th style="text-align: right; padding-right: 24px;">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${data.map(item => `
                            <tr class="hover-row" onclick="window.navigateTo('contractDetail', {id: '${item.id}', from: 'contract-management'})" style="cursor: pointer;">
                                <td style="padding-left: 24px;"><span style="font-family: monospace; color: #64748b;">${item.id}</span></td>
                                <td><span style="font-weight: 600; color: var(--text-main)">${item.name}</span></td>
                                <td><span class="status-chip" style="background: #f1f5f9; color: #475569;">${item.type}</span></td>
                                <td><span class="text-muted">${item.date}</span></td>
                                <td><span class="text-muted">${item.expireDate || '-'}</span></td>
                                <td>
                                    <span class="status-chip ${item.status === 'active' ? 'status-active' : ''}" 
                                          style="background: ${item.status === 'expired' ? '#f1f5f9' : ''}; color: ${item.status === 'expired' ? '#94a3b8' : ''};">
                                        ${item.statusText}
                                    </span>
                                </td>
                                <td style="text-align: right; padding-right: 24px; overflow: visible;" onclick="event.stopPropagation()">
                                    <div class="action-cell" style="justify-content: flex-end; min-width: 140px;">
                                        ${window.renderActionMenu(item, 1)}
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                `;
};

window.downloadContract = (id) => {
    showToast(`开始下载合同文件 ${id}...`);
    setTimeout(() => {
        showToast('下载完成');
    }, 1500);
};

window.previewContract = (id) => {
    const contract = window.contractData.find(c => c.id === id);
    if (!contract) return;

    const modalHtml = `
                <div class="modal-overlay" id="contract-preview-modal">
                    <div class="card" style="width: 800px; max-width: 95vw; height: 85vh; padding: 0; overflow: hidden; border-radius: 16px; display: flex; flex-direction: column;">
                        <div class="card-header" style="padding: 16px 24px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; background: white;">
                            <h3 style="margin: 0; font-weight: 700; font-size: 1.1rem;">合同预览 - ${contract.name}</h3>
                            <button class="btn-text" onclick="document.getElementById('contract-preview-modal').remove()" style="font-size: 1.5rem; color: #64748b;">&times;</button>
                        </div>
                        <div style="flex: 1; background: #f8fafc; padding: 32px; overflow-y: auto; text-align: center;">
                            <div style="background: white; width: 100%; max-width: 700px; min-height: 800px; margin: 0 auto; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); padding: 48px; text-align: left;">
                                <h1 style="text-align: center; font-size: 1.5rem; margin-bottom: 32px;">物流运输服务合同</h1>
                                <div style="margin-bottom: 24px; font-family: 'Courier New', monospace; color: #64748b;">
                                    <p>合同编号：${contract.id}</p>
                                    <p>签署日期：${contract.date}</p>
                                    <p>有效期至：${contract.expireDate || '长期有效'}</p>
                                </div>
                                <div style="line-height: 1.8; color: #334155;">
                                    <p style="margin-bottom: 16px;"><strong>甲方（托运方）：</strong>货主企业</p>
                                    <p style="margin-bottom: 16px;"><strong>乙方（承运方）：</strong>${contract.signer}</p>
                                    <p style="margin-bottom: 16px;">鉴于甲方需要物流运输服务，乙方具备相应的运输资质和能力，双方经友好协商，达成如下协议：</p>
                                    <p style="margin-bottom: 16px;">第一条  服务内容<br>乙方根据甲方指令，将货物运送至指定地点...</p>
                                    <p style="margin-bottom: 16px;">第二条  运输费用<br>具体运价详见附件报价单...</p>
                                    <p style="margin-bottom: 16px;">第三条  违约责任<br>任何一方违反本合同约定，应承担违约责任...</p>
                                    <p style="margin-top: 48px; text-align: center; color: #94a3b8;">(以下无正文)</p>
                                </div>
                            </div>
                        </div>
                        <div style="padding: 16px 24px; border-top: 1px solid #e2e8f0; background: white; display: flex; justify-content: flex-end; gap: 12px;">
                            <button class="btn" style="background: #f1f5f9; color: #475569;" onclick="document.getElementById('contract-preview-modal').remove()">关闭预览</button>
                            <button class="btn btn-primary" onclick="window.downloadContract('${contract.id}')"><i class="fas fa-download"></i> 下载文件</button>
                        </div>
                    </div>
                </div>
                `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
};



window.renderCargoManagement2 = (container) => {
    const statuses = [
        '全部', '草稿', '未接单', '已接单', '运输中', '已签收',
        '已回单', '已结算', '已完成',
        '已取消', '回收站'
    ];

    // Status color mapping for badges
    window.getStatusStyle = (status) => {
        const styles = {
            '未接单': 'background: #dcfce7; color: #166534;', // Greenish
            '已接单': 'background: #fef9c3; color: #854d0e;', // Yellowish
            '已签收': 'background: #dcfce7; color: #166534;',
            '待评价': 'background: #f3e8ff; color: #6b21a8;', // Purple
            '运输中': 'background: #e0f2fe; color: #075985;', // Blue
            '草稿': 'background: #f1f5f9; color: #64748b;',
            '已回单': 'background: #dcfce7; color: #166534;',
            '已电子回单': 'background: #dcfce7; color: #166534;', // Keep for compatibility
            '已纸质回单': 'background: #dcfce7; color: #166534;', // Keep for compatibility
            '已结算': 'background: #dcfce7; color: #166534;',
            '已完成': 'background: #f1f5f9; color: #64748b;',
            '已取消': 'background: #fee2e2; color: #991b1b;',
            '回收站': 'background: #fee2e2; color: #991b1b;',
            '默认': 'background: #f1f5f9; color: #334155;'
        };
        return styles[status] || styles[status.replace('已', '待')] || styles['默认']; // Fallback
    };

    const activeTab = window.currentCargo2Tab || '全部';

    const getFilteredData = () => {
        let data = window.cargoData2;

        // 1. Tab Filter
        if (activeTab !== '全部') {
            if (activeTab === '已回单') {
                data = data.filter(item => item.statusText === '已电子回单' || item.statusText === '已纸质回单');
            } else {
                data = data.filter(item => item.statusText === activeTab || item.status === activeTab);
            }
        }

        // 2. Search Controls Filter
        const filters = window.currentCargoFilters || {};
        if (filters.client) {
            data = data.filter(item => item.customer && item.customer.toLowerCase().includes(filters.client));
        }
        if (filters.start) {
            data = data.filter(item => item.start && item.start.includes(filters.start));
        }
        if (filters.end) {
            data = data.filter(item => item.end && item.end.includes(filters.end));
        }

        // Filter out '异常运单' as it is deleted
        data = data.filter(item => item.statusText !== '异常运单');

        return data;
    };

    const filteredData = getFilteredData();

    container.innerHTML = `
                <div class="page-header" style="margin-bottom: 24px;">
                    <div class="page-title">
                        <h1>货源管理</h1>
                        <p>管理货源发布、分配及运单生成。</p>
                    </div>
                    <div>
                        <button class="btn" style="background: white; border: 1px solid #e2e8f0; margin-right: 12px; color: #1e293b;" onclick="showToast('导出功能开发中')">
                            <i class="fas fa-download"></i> 导出
                        </button>
                        <button class="btn btn-primary" style="background: #5345ec;" onclick="window.openPublishCargoModal()">
                            <i class="fas fa-plus"></i> 发布货单
                        </button>
                    </div>
                </div>

                <div class="card" style="padding: 20px; border-radius: 12px; box-shadow: var(--shadow-sm);">
                    <!-- Filters -->
                    <div style="display: flex; gap: 16px; margin-bottom: 20px; padding: 16px; background: #f8fafc; border-radius: 8px; align-items: flex-end;">
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; flex: 1;">
                            <input type="text" id="filter-client" placeholder="客户名称" style="padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
                            <input type="text" id="filter-start" placeholder="装货地" style="padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
                            <input type="text" id="filter-end" placeholder="卸货地" style="padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
                            <input type="date" id="filter-date" style="padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
                        </div>
                        <button class="btn btn-primary" onclick="window.filterCargoList()" style="height: 38px; padding: 0 20px;">
                            <i class="fas fa-search"></i> 查询
                        </button>
                    </div>

                    <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9;">
                        ${statuses.map(status => `
                    <div class="filter-chip ${activeTab === status ? 'active' : ''}" 
                         onclick="window.switchCargo2Tab('${status}')"
                         style="padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 0.9rem; font-weight: 500; transition: all 0.2s; 
                         ${activeTab === status ? 'background: #5345ec; color: white;' : 'background: #f8fafc; color: #64748b;'}">
                        ${status}
                    </div>
                `).join('')}
                    </div>

                    <!-- Table -->
                    <table class="data-table" style="width: 100%;">
                        <thead>
                            <tr style="color: #64748b; font-size: 0.85rem; border-bottom: 1px solid #e2e8f0;">
                                <th style="padding: 16px; text-align: left;">货单号</th>
                                <th style="padding: 16px; text-align: left;">装货地 / 卸货地</th>
                                <th style="padding: 16px; text-align: left;">客户 / 货物</th>
                                <th style="padding: 16px; text-align: left;">数量 / 重量</th>
                                <th style="padding: 16px; text-align: left;">约定时间/详情</th>
                                <th style="padding: 16px; text-align: left;">关联运单</th>
                                <th style="padding: 16px; text-align: left; min-width: 100px;">当前状态</th>
                                <th style="padding: 16px; text-align: left; min-width: 150px;">
                                    <div class="action-column-header">
                                        操作 <i class="fas fa-cog" style="color:#4f46e5; cursor:pointer;" onclick="showToast('设置功能开发中')"></i>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredData.map(item => {
        // Normalize status display
        let displayStatus = item.statusText;
        if (displayStatus === '已电子回单' || displayStatus === '已纸质回单') {
            displayStatus = '已回单';
        }

        return `
                        <tr onclick="window.navigateTo('cargoDetail', {id: '${item.id}', from: 'cargoList'})" style="cursor: pointer; border-bottom: 1px solid #f8fafc; transition: background 0.2s;" onmouseover="this.style.background='#f8fbff'" onmouseout="this.style.background='transparent'">
                            <td style="padding: 20px 16px; color: #4f46e5; font-weight: 700; font-family: monospace; font-size: 1rem;">${item.id}</td>
                            <td style="padding: 20px 16px;">
                                <div style="font-weight: 700; color: #1e293b; font-size: 1rem; margin-bottom: 4px;">${item.start} <i class="fas fa-arrow-right" style="color:#94a3b8; font-size: 0.8rem; margin: 0 4px;"></i> ${item.end}</div>
                            </td>
                            <td style="padding: 20px 16px;">
                                <div style="font-weight: 700; color: #1e293b;">${item.customer.split('\n')[0]}</div>
                                <div style="color: #94a3b8; font-size: 0.85rem; margin-top: 4px;">${item.customer.split('\n')[1] || ''}</div>
                            </td>
                            <td style="padding: 20px 16px; font-weight: 600; color: #334155;">${item.quantity}</td>
                            <td style="padding: 20px 16px;">
                                <div style="font-weight: 600; color: #334155;">${item.time.split('\n')[0]}</div>
                                <div style="color: #94a3b8; font-size: 0.85rem; margin-top: 4px;">${item.time.split('\n')[1] || ''}</div>
                            </td>
                            <td>
                                    ${(item.waybills && item.waybills.length > 0) ? `
                                        <div style="display:flex; flex-wrap:wrap; gap:8px;">
                                            ${item.waybills.map(wb => `
                                                <span onclick="event.stopPropagation(); window.navigateTo('waybillDetail', {id: '${wb.id}', from: 'cargoList'})" 
                                                      style="font-family: monospace; color: #4f46e5; background: #eef2ff; padding: 2px 6px; border-radius: 4px; font-size: 0.85rem; cursor: pointer; white-space: nowrap;">
                                                    ${wb.id}
                                                </span>
                                            `).join('')}
                                        </div>
                                    ` : (['已接单', '运输中', '已签收', '待评价', '已完成'].includes(item.statusText) ? `<span style="color:#94a3b8; font-size:0.85rem;">单运单</span>` : '-')}
                                </td>
                            <td style="padding: 20px 16px;">
                                <div style="display: flex; align-items: center; gap: 8px; white-space: nowrap;">
                                    <span style="padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; min-width: 80px; text-align: center; white-space: nowrap; ${window.getStatusStyle(displayStatus)}">
                                        ${displayStatus}
                                    </span>
                                </div>
                            </td>
                            <td style="padding: 20px 16px; text-align: left; overflow: visible;" onclick="event.stopPropagation()">
                                <div class="action-cell" style="justify-content: flex-start; min-width: 140px;">
                                    ${window.renderActionMenu(item)}
                                </div>
                            </td>
                        </tr>
                    `;
    }).join('')}
                            ${filteredData.length === 0 ? `<tr><td colspan="8" style="text-align: center; padding: 60px; color: #94a3b8;">暂无此状态的货单数据</td></tr>` : ''}
                        </tbody>
                    </table>
                </div>
                `;
};

window.switchCargo2Tab = (tab) => {
    window.currentCargo2Tab = tab;
    renderCargoManagement2(document.getElementById('view-container'));
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


const renderAfterSales = (container) => {
    container.innerHTML = `
        <div class="page-header">
            <div class="page-title">
                <h1>售后管理</h1>
                <p>处理异常反馈、投诉建议及理赔申请。</p>
            </div>
            <button class="btn btn-primary" onclick="window.openCreateTicketModal()"><i class="fas fa-plus"></i> 新建工单</button>
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
                    ${renderClaimRows(window.afterSalesData.filter(c => c.status === 'pending'))}
                </tbody>
            </table>
        </div>
    `;

    // Tab Switching Logic
    container.querySelectorAll('.tab-item').forEach(tab => {
        tab.addEventListener('click', (e) => {
            container.querySelectorAll('.tab-item').forEach(t => {
                t.classList.remove('active');
                t.style.borderBottomColor = 'transparent';
                t.style.color = 'var(--text-muted)';
                t.style.fontWeight = '500';
            });
            e.target.classList.add('active');
            e.target.style.borderBottomColor = 'var(--primary-color)';
            e.target.style.color = 'var(--primary-color)';
            e.target.style.fontWeight = '600';

            const tabType = e.target.getAttribute('data-tab');
            const filteredData = window.afterSalesData.filter(c => c.status === tabType);
            document.getElementById('as-table-body').innerHTML = renderClaimRows(filteredData);
        });
    });
};

const renderClaimRows = (claims) => {
    if (claims.length === 0) return `<tr><td colspan="6" style="text-align:center; padding: 40px; color:#9ca3af;">暂无数据</td></tr>`;

    return claims.map(claim => {
        let statusColor = claim.status === 'pending' ? '#ef4444' : '#10b981';
        let bg = claim.status === 'pending' ? '#fee2e2' : '#dcfce7';
        let btn = `<button class="btn-text" onclick="window.openClaimDetailView('${claim.id}')">查看详情</button>`;

        return `
                <tr>
                    <td><span style="font-weight:600;">${claim.id}</span></td>
                    <td style="color:var(--primary-color); cursor:pointer;">${claim.orderId}</td>
                    <td>${claim.type}</td>
                    <td><span class="status-chip" style="background:${bg}; color:${statusColor}; font-weight:500;">${claim.statusText}</span></td>
                    <td>${claim.time}</td>
                    <td>${btn}</td>
                </tr>
                `;
    }).join('');
};

// --- New Ticket Logic ---
window.openCreateTicketModal = () => {
    const orders = window.cargoData || [];
    const modalHtml = `
                <div class="modal-overlay" id="as-create-modal">
                    <div class="card" style="width: 550px; border-radius: 20px; overflow: hidden; padding: 0;">
                        <div class="card-header" style="padding: 24px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
                            <h3 style="margin: 0; font-weight: 700;">新建售后工单</h3>
                            <button class="btn-text" onclick="document.getElementById('as-create-modal').remove()" style="font-size: 1.5rem;">&times;</button>
                        </div>
                        <div style="padding: 24px;">
                            <div style="margin-bottom: 16px;">
                                <label style="display: block; margin-bottom: 8px; font-weight: 600;">关联运单</label>
                                <select id="as-order-id" class="form-input">
                                    <option value="">请选择运单</option>
                                    ${orders.map(o => `<option value="${o.id}">${o.id} (${o.route.replace(/<[^>]*>?/gm, '')})</option>`).join('')}
                                </select>
                            </div>
                            <div style="margin-bottom: 16px;">
                                <label style="display: block; margin-bottom: 8px; font-weight: 600;">问题类型</label>
                                <select id="as-type" class="form-input">
                                    <option value="货物破损">货物破损</option>
                                    <option value="延时到达">延时到达</option>
                                    <option value="运费争议">运费争议</option>
                                    <option value="货物丢失">货物丢失</option>
                                    <option value="客服服务">客服服务</option>
                                    <option value="其他">其他</option>
                                </select>
                            </div>
                            <div style="margin-bottom: 24px;">
                                <label style="display: block; margin-bottom: 8px; font-weight: 600;">描述说明</label>
                                <textarea id="as-desc" class="form-input" style="height: 100px; resize: none; padding-top: 10px;" placeholder="请详细描述售后问题"></textarea>
                            </div>
                            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                                <button class="btn" style="background: #f1f5f9; color: #475569;" onclick="document.getElementById('as-create-modal').remove()">取消</button>
                                <button class="btn btn-primary" style="background:#5345ec;" onclick="window.saveAsTicket()">提交工单</button>
                            </div>
                        </div>
                    </div>
                </div>
                `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.saveAsTicket = () => {
    const orderId = document.getElementById('as-order-id').value;
    const type = document.getElementById('as-type').value;
    const desc = document.getElementById('as-desc').value;

    if (!orderId || !desc) {
        showToast('请填写完整工单信息');
        return;
    }

    const newTicket = {
        id: '#AS-' + (100 + window.afterSalesData.length + 1),
        orderId: orderId,
        type: type,
        status: 'pending',
        statusText: '处理中',
        time: new Date().toLocaleString(),
        description: desc,
        result: ''
    };

    window.afterSalesData.unshift(newTicket);
    showToast('工单创建成功');
    document.getElementById('as-create-modal').remove();
    renderAfterSales(document.getElementById('view-container'));
};

// --- Process Claim Logic ---
window.openProcessClaimModal = (claimId) => {
    const claim = window.afterSalesData.find(c => c.id === claimId);
    if (!claim) return;

    const modalHtml = `
                <div class="modal-overlay" id="as-process-modal">
                    <div class="card" style="width: 600px; border-radius: 20px; overflow: hidden; padding: 0;">
                        <div class="card-header" style="padding: 24px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
                            <h3 style="margin: 0; font-weight: 700;">处理售后工单 - ${claimId}</h3>
                            <button class="btn-text" onclick="document.getElementById('as-process-modal').remove()" style="font-size: 1.5rem;">&times;</button>
                        </div>
                        <div style="padding: 24px;">
                            <div style="background: #f8fafc; padding: 16px; border-radius: 12px; margin-bottom: 24px;">
                                <div style="margin-bottom: 8px;"><span style="color: #64748b;">工单类型：</span><span style="font-weight: 600;">${claim.type}</span></div>
                                <div style="margin-bottom: 8px;"><span style="color: #64748b;">反馈时间：</span><span>${claim.time}</span></div>
                                <div><span style="color: #64748b;">问题描述：</span><p style="margin: 8px 0 0 0; color: #1e293b; line-height: 1.5;">${claim.description}</p></div>
                            </div>

                            <div style="margin-bottom: 24px;">
                                <label style="display: block; margin-bottom: 8px; font-weight: 600;">处理意见/结果</label>
                                <textarea id="as-result" class="form-input" style="height: 120px; resize: none; padding-top: 10px;" placeholder="请录入最终处理方案或沟通记录"></textarea>
                            </div>

                            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                                <button class="btn" style="background: #f1f5f9; color: #475569;" onclick="document.getElementById('as-process-modal').remove()">取消</button>
                                <button class="btn btn-primary" style="background:#10b981;" onclick="window.confirmAsProcess('${claimId}')">完结处理</button>
                            </div>
                        </div>
                    </div>
                </div>
                `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.confirmAsProcess = (claimId) => {
    const result = document.getElementById('as-result').value;
    if (!result) {
        showToast('请录入处理结果');
        return;
    }

    const claim = window.afterSalesData.find(c => c.id === claimId);
    if (claim) {
        claim.status = 'processed';
        claim.statusText = '已结案';
        claim.result = result;
        showToast('工单处理已完结');
        document.getElementById('as-process-modal').remove();
        renderAfterSales(document.getElementById('view-container'));
    }
};

window.openClaimDetailView = (claimId) => {
    const claim = window.afterSalesData.find(c => c.id === claimId);
    if (!claim) return;

    const modalHtml = `
                <div class="modal-overlay" id="as-detail-modal-view">
                    <div class="card" style="width: 600px; border-radius: 20px; overflow: hidden; padding: 0;">
                        <div class="card-header" style="padding: 24px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
                            <h3 style="margin: 0; font-weight: 700;">售后工单详情 - ${claimId}</h3>
                            <button class="btn-text" onclick="document.getElementById('as-detail-modal-view').remove()" style="font-size: 1.5rem;">&times;</button>
                        </div>
                        <div style="padding: 24px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
                                <div><div style="color: #64748b; font-size: 0.9rem; margin-bottom: 4px;">工单状态</div><div style="color: #10b981; font-weight: 700;">${claim.statusText}</div></div>
                                <div><div style="color: #64748b; font-size: 0.9rem; margin-bottom: 4px;">反馈时间</div><div>${claim.time}</div></div>
                            </div>
                            <div style="margin-bottom: 24px;">
                                <h4 style="margin: 0 0 12px 0; font-size: 1rem;">反馈内容</h4>
                                <div style="background: #f8fafc; padding: 16px; border-radius: 12px; line-height: 1.6; color: #1e293b;">
                                    ${claim.description}
                                </div>
                            </div>
                            <div>
                                <h4 style="margin: 0 0 12px 0; font-size: 1rem;">处理结果</h4>
                                <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 12px; line-height: 1.6; color: #166534;">
                                    ${claim.result || '暂无详细记录'}
                                </div>
                            </div>
                            <div style="margin-top: 32px; text-align: right;">
                                <button class="btn" style="background: #f1f5f9; color: #475569; padding: 10px 32px;" onclick="document.getElementById('as-detail-modal-view').remove()">关闭界面</button>
                            </div>
                        </div>
                    </div>
                </div>
                `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
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
        <div class="card" style="padding: 10px;">
            <div class="message-item active" style="margin-bottom: 10px; color:var(--text-main); display:flex; justify-content:space-between; padding:18px; border-radius:12px; border:1px solid #eef2f6;">
                <span style="font-weight: 500;">[运单动态] 您的运单 #ORD-9021 已进入广州区域，预计2小时内送达。</span>
                <span style="font-size:0.75rem; color:var(--text-muted)">10:45</span>
            </div>
            <div class="message-item" style="margin-bottom: 10px; border:1px solid #f1f5f9; color:var(--text-main); display:flex; justify-content:space-between; padding:18px; border-radius:12px;">
                <span style="font-weight: 500;">[系统通知] 您的企业认证已通过审核。</span>
                <span style="font-size:0.75rem; color:var(--text-muted)">昨天</span>
            </div>
            <div class="message-item" style="margin-bottom: 10px; border:1px solid #f1f5f9; color:var(--text-main); display:flex; justify-content:space-between; padding:18px; border-radius:12px;">
                <span style="font-weight: 500;">[专属推荐] 发现有3台匹配您线路的回程车，点击查看。</span>
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
                                <option="station3">无锡新区集散地 (距目的地68km)</option>
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
                        <div class="stat-icon" style="background: #fef9c3; color: #854d0e;"><i class="fas fa-envelope-open-text"></i></div>
                        <div class="stat-label">待上传</div>
                        <div class="stat-value">12 <span class="trend-badge trend-up">跟进中</span></div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background: #eff6ff; color: #1e40af;"><i class="fas fa-box-open"></i></div>
                        <div class="stat-label">待签收</div>
                        <div class="stat-value">5 <span class="trend-badge trend-up">运输中</span></div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background: #dcfce7; color: #15803d;"><i class="fas fa-check-double"></i></div>
                        <div class="stat-label">已签收</div>
                        <div class="stat-value">28</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background: #f1f5f9; color: #64748b;"><i class="fas fa-history"></i></div>
                        <div class="stat-label">月度合规率</div>
                        <div class="stat-value">99.4%</div>
                    </div>
                </div>

                <div class="card">
                    <!-- New Search Filters -->
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; padding: 16px; border-bottom: 1px solid #f1f5f9; background: #fff;">
                        <input type="text" placeholder="运单号" style="padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px; width: 100%;">
                        <input type="text" placeholder="配载单号" style="padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px; width: 100%;">
                        <input type="text" placeholder="客户名称" style="padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px; width: 100%;">
                        <input type="date" style="padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px; width: 100%;">
                    </div>

                    <div class="filter-tab-container" style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px;">
                        <div style="display: flex; gap: 20px;">
                            <div class="filter-tab active" data-filter="all">全部</div>
                            <div class="filter-tab" data-filter="pending-upload">待上传</div>

                            <div class="filter-tab" data-filter="pending-p">待签收</div>
                            <div class="filter-tab" data-filter="completed">已签收</div>
                        </div>
                        </div>
                    </div>

                    <table class="data-table">
                        <thead>
                            <tr>
                                <th style="width: 140px;">运单号</th>
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
    const filterTabs = container.querySelectorAll('.filter-tab');
    const searchInput = container.querySelector('#receipt-search');
    let currentFilter = 'all';
    let currentSearch = '';

    const applyFilters = () => {
        let filtered = receiptData;

        // Apply Tab Filter
        if (currentFilter === 'pending-upload') {
            filtered = filtered.filter(item => item.status === 'signed' || item.status === 'loading');
        } else if (currentFilter === 'pending-e') {
            filtered = filtered.filter(item => item.status === 'received');
        } else if (currentFilter === 'pending-p') {
            filtered = filtered.filter(item => item.status === 'returned');
        } else if (currentFilter === 'completed') {
            filtered = filtered.filter(item => item.status === 'reviewed' || item.status === 'settled');
        }

        // Apply Search Filter
        if (currentSearch) {
            filtered = filtered.filter(item => item.client.includes(currentSearch));
        }

        document.getElementById('receipt-table-body').innerHTML = renderReceiptRows(filtered);
    };

    filterTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            filterTabs.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.getAttribute('data-filter');
            applyFilters();
        });
    });

    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.trim();
        applyFilters();
    });
};

const renderReceiptRows = (data) => {
    if (data.length === 0) return `<tr><td colspan="6" style="text-align:center; padding:20px;">暂无回单数据</td></tr>`;

    return data.slice(0, 8).map(item => {
        const eStatus = ['reviewed', 'returned', 'received'].includes(item.status) ? '已上传' : '未上传';
        // Only show '寄送中' if electronic receipt is uploaded (i.e. process has started)
        const pStatus = item.status === 'reviewed' ? '已收回' : (eStatus === '已上传' ? '寄送中' : '');
        const pBadge = pStatus === '已收回' ? 'status-active' : (pStatus ? 'status-pending' : '');

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

                            ${cargo.courierNumber ? `
                            <div style="margin-bottom: 16px;">
                                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">快递单号</label>
                                <span style="font-weight: 600;">${cargo.courierNumber}</span>
                            </div>` : ''}
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
                                        <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 8px;">回单照片</label>
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
                            ${cargo.status === 'received' ? `<button class="btn btn-primary" style="padding: 10px 24px; background-color: #f59e0b; border-color: #f59e0b;" onclick="window.approveReceipt('${cargo.id}')"><i class="fas fa-check-circle"></i> 审核</button>` : ''}
                            ${cargo.status === 'returned' ? `<button class="btn btn-primary" style="padding: 10px 24px; background-color: #10b981; border-color: #10b981;" onclick="window.confirmPaperReceipt('${cargo.id}')"><i class="fas fa-check-double"></i> 确认收回</button>` : ''}
                            ${(cargo.status === 'signed' || cargo.status === 'loading') ?
            `<button class="btn btn-primary" style="padding: 10px 24px; margin-right: 12px; background-color: #10b981; border-color: #10b981;" onclick="window.confirmPaperReceipt('${cargo.id}')"><i class="fas fa-check-double"></i> 确认收回</button>
             <button class="btn btn-primary" style="padding: 10px 24px;" onclick="window.saveReceipt('${cargo.id}')"><i class="fas fa-save"></i> 保存</button>` :
            `<button class="btn btn-primary" style="padding: 10px 24px;" onclick="window.printReceipt('${cargo.id}')"><i class="fas fa-print"></i> 打印回单</button>`
        }
                        </div>
                    </div>
                    `;
    modalContainer.classList.remove('hidden');
    modalContainer.style.display = 'flex';
};

window.printReceipt = (id) => {
    showToast(`正在上传回单... (单号：${id})`);
};

window.saveReceipt = (id) => {
    const cargo = window.cargoData.find(c => c.id === id);
    if (cargo) {
        cargo.status = 'returned';
        cargo.statusText = '待评价';

        // Close modal if open
        const modalContainer = document.getElementById('modal-container');
        if (modalContainer) modalContainer.classList.add('hidden');

        switchView('receipt-management');
        showToast('保存成功');
    }
};

window.approveReceipt = (id) => {
    const cargo = window.cargoData.find(c => c.id === id);
    if (cargo) {
        cargo.status = 'returned';
        cargo.statusText = '待评价';

        // Close modal if open
        const modalContainer = document.getElementById('modal-container');
        if (modalContainer) modalContainer.classList.add('hidden');

        switchView('receipt-management');
        showToast('电子回单审核通过');
    }
};

window.confirmPaperReceipt = (id) => {
    // Open the secondary confirmation modal
    const overlay = document.createElement('div');
    overlay.id = 'recovery-confirm-modal';
    overlay.style = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:2000;display:flex;justify-content:center;align-items:center;';
    overlay.innerHTML = `
        <div class="modal-content" style="background:#fff;border-radius:12px;width:400px;padding:24px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04);">
            <h3 style="font-weight:700;margin-bottom:12px;font-size:1.1rem;color:#1e293b;">确认收回</h3>
            <p style="color:#64748b;font-size:0.9rem;margin-bottom:20px;line-height:1.5;">确认收回后将自动请款，请选择纸质回单付款类型</p>
            
            <div style="margin-bottom:20px;">
                <label style="display:block;font-size:0.85rem;color:#475569;margin-bottom:6px;font-weight:500;">快递单号</label>
                <input type="text" id="courier-number" style="width:100%;padding:8px 12px;border:1px solid #e2e8f0;border-radius:6px;outline:none;transition:border-color 0.2s;" placeholder="请输入快递单号">
            </div>

            <div style="margin-bottom:20px;display:flex;gap:20px;">
                <label style="cursor:pointer;display:flex;align-items:center;gap:6px;">
                    <input type="radio" name="payType" value="prepaid" checked onchange="window.toggleCollectInput(false)"> 
                    <span style="color:#334155;font-weight:500;">寄付</span>
                </label>
                <label style="cursor:pointer;display:flex;align-items:center;gap:6px;">
                    <input type="radio" name="payType" value="collect" onchange="window.toggleCollectInput(true)"> 
                    <span style="color:#334155;font-weight:500;">到付</span>
                </label>
            </div>
            
            <div id="collect-input-container" style="display:none;margin-bottom:24px;">
                <label style="display:block;font-size:0.85rem;color:#475569;margin-bottom:6px;font-weight:500;">到付金额</label>
                <div style="position:relative;">
                    <span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:#94a3b8;">¥</span>
                    <input type="number" id="collect-amount" style="width:100%;padding:8px 12px 8px 24px;border:1px solid #e2e8f0;border-radius:6px;outline:none;transition:border-color 0.2s;" placeholder="0.00">
                </div>
            </div>
            
            <div style="display:flex;justify-content:flex-end;gap:12px;">
                <button class="btn" onclick="document.getElementById('recovery-confirm-modal').remove()" style="padding:8px 20px;border:1px solid #e2e8f0;border-radius:6px;background:#fff;color:#475569;">取消</button>
                <button class="btn btn-primary" onclick="window.submitRecovery('${id}')" style="padding:8px 20px;border-radius:6px;background:var(--primary-color);color:#fff;border:none;">确认</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
};

window.toggleCollectInput = (show) => {
    const container = document.getElementById('collect-input-container');
    if (show) {
        container.style.display = 'block';
        document.getElementById('collect-amount').focus();
    } else {
        container.style.display = 'none';
    }
};

window.submitRecovery = (id) => {
    const payType = document.querySelector('input[name="payType"]:checked').value;
    const courierNumber = document.getElementById('courier-number').value.trim();
    let amount = 0;

    if (payType === 'collect') {
        const input = document.getElementById('collect-amount');
        amount = parseFloat(input.value);
        if (!amount || amount <= 0) {
            alert('请输入有效的到付金额');
            return;
        }
    }

    // Original Logic
    const cargo = window.cargoData.find(c => c.id === id);
    if (cargo) {
        cargo.status = 'reviewed';
        cargo.statusText = '已完成';
        // cargo.paymentType = payType;
        cargo.courierNumber = courierNumber;

        // Remove confirm modal
        document.getElementById('recovery-confirm-modal').remove();

        // Close details modal if open
        const modalContainer = document.getElementById('modal-container');
        if (modalContainer) modalContainer.classList.add('hidden');

        switchView('receipt-management');
        const payInfo = payType === 'prepaid' ? '寄付' : `到付 ¥${amount}`;
        const courierInfo = courierNumber ? `快递单号:${courierNumber}` : '无快递单号';
        showToast(`纸质回单已收回 (${payInfo}, ${courierInfo})，订单已完结`);
    }
};



// Initialize Order Track Data
window.orderTrackData = {
    'YD2512298401-1': [
        { status: '运输中', time: '2026-01-03 16:00', location: '湖南省 长沙市', desc: '车辆已到达长沙分拨中心，正在发往广州' },
        { status: '运输中', time: '2026-01-03 10:00', location: '湖北省 武汉市', desc: '车辆已从武汉出发，下一站长沙' },
        { status: '已接单', time: '2026-01-03 09:00', location: '湖北省 武汉市', desc: '司机赵五已接单，前往装货点' }
    ],
    'YD2512298401-2': [
        { status: '已签收', time: '2026-01-03 12:00', location: '广东省 广州市', desc: '货物已签收，签收人：张三' },
        { status: '派送中', time: '2026-01-03 10:00', location: '广东省 广州市', desc: '派送员正在派送中' },
        { status: '运输中', time: '2026-01-02 20:00', location: '湖南省 长沙市', desc: '车辆已离开长沙，发往广州' }
    ],

    'CG2512298401': [
        { time: '2026-01-04 15:50', status: '运输中', location: '湖南郴州', desc: '进入湖南境内，预计2小时后经过衡阳' },
        { time: '2026-01-04 13:20', status: '运输中', location: '韶关曲江区', desc: '车辆行驶至京港澳高速韶关段' },
        { time: '2026-01-04 10:45', status: '经停点', location: '清远太和镇', desc: '车辆到达清远分拨中心进行装卸' },
        { time: '2026-01-04 08:30', status: '已起运', location: '广州天河区', desc: '车辆出发，配送员：王师傅' }
    ],
    'CG2512298402': [
        { time: '2026-01-04 16:20', status: '已收货', location: '成都双流', desc: '货物已签收，回单确认中' },
        { time: '2026-01-04 15:30', status: '已到达', location: '成都双流', desc: '车辆到达目的地网点' },
        { time: '2026-01-04 09:00', status: '已起运', location: '江门蓬江', desc: '车辆出发，配送员：陈师傅' }
    ],
    '#ORD-9021': [
        { time: '2026-01-04 15:50', status: '运输中', location: '湖南郴州', desc: '进入湖南境内，预计2小时后经过衡阳' },
        { time: '2026-01-04 13:20', status: '运输中', location: '韶关曲江区', desc: '车辆行驶至京港澳高速韶关段' },
        { time: '2026-01-04 10:45', status: '经停点', location: '清远太和镇', desc: '车辆到达清远分拨中心进行装卸' },
        { time: '2026-01-04 08:30', status: '已起运', location: '广州天河区', desc: '车辆出发，配送员：王师傅' }
    ],
    '#ORD-9018': [
        { time: '2026-01-04 09:15', status: '运输中', location: '江西南昌', desc: '经过南昌绕城高速' },
        { time: '2026-01-04 02:00', status: '运输中', location: '江西赣州', desc: '车辆在赣州休息点停留检查' },
        { time: '2026-01-03 16:30', status: '运输中', location: '广东东莞', desc: '经过松山湖路段' },
        { time: '2026-01-03 14:00', status: '已起运', location: '中山火炬', desc: '车辆出发，配送员：李师傅' }
    ],
    '#ORD-9015': [
        { time: '2026-01-03 16:20', status: '已收货', location: '武汉江夏', desc: '货物已签收，回单确认中' },
        { time: '2026-01-03 15:30', status: '已到达', location: '武汉江夏', desc: '车辆到达目的地网点' },
        { time: '2026-01-02 09:00', status: '已起运', location: '东莞松山湖', desc: '车辆出发，配送员：陈师傅' }
    ]
};

window.openCargo2ReviewModal = (itemId) => {
    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = `
                    <div class="modal-content" style="width: 500px; background: #fff; border-radius: 20px; padding: 0; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">
                        <div style="padding: 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9;">
                            <h2 style="font-size: 1.25rem; font-weight: 700; color: #1e293b;">服务互评</h2>
                            <button onclick="document.getElementById('modal-container').classList.add('hidden')" style="background: none; border: none; font-size: 1.5rem; color: #94a3b8; cursor: pointer; line-height: 1;">&times;</button>
                        </div>
                        <div style="padding: 24px;">
                            <h3 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 20px;">评价司机服务 (人工打分)</h3>

                            <div style="margin-bottom: 24px;">
                                <div style="color: #64748b; font-size: 0.9rem; margin-bottom: 8px;">服务态度</div>
                                <div style="display: flex; gap: 8px; color: #f59e0b; font-size: 1.5rem;">
                                    <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i>
                                </div>
                            </div>

                            <div style="margin-bottom: 24px;">
                                <div style="color: #64748b; font-size: 0.9rem; margin-bottom: 8px;">运输速度</div>
                                <div style="display: flex; gap: 8px; color: #f59e0b; font-size: 1.5rem;">
                                    <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                                </div>
                            </div>

                            <div style="margin-bottom: 32px;">
                                <h3 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 16px;">写下评价</h3>
                                <textarea placeholder="对货主/司机的评价内容..." style="width: 100%; height: 120px; padding: 16px; border: 1px solid #e2e8f0; border-radius: 12px; resize: none; font-size: 0.95rem; font-family: inherit; outline: none; transition: border 0.3s;" onfocus="this.style.borderColor='#4f46e5'"></textarea>
                            </div>

                            <div style="display: flex; justify-content: flex-end;">
                                <button class="btn btn-primary" onclick="window.confirmCargo2Review('${itemId}')" style="background: #5345ec; padding: 12px 32px; border-radius: 12px; font-weight: 700; font-size: 0.95rem;">提交互评</button>
                            </div>
                        </div>
                    </div>
                    `;
    modalContainer.classList.remove('hidden');
    modalContainer.style.display = 'flex';
};

window.confirmCargo2Review = (itemId) => {
    const item = window.cargoData2.find(it => it.id === itemId);
    if (item) {
        item.status = 'reviewed';
        item.statusText = '已完成';
        item.actions = ['查看', '再来一单']; // Update actions
        showToast('评价提交成功');
        document.getElementById('modal-container').classList.add('hidden');
        renderCargoManagement2(document.getElementById('view-container'));
    }
};

window.viewCargo2Receipt = (itemId) => {
    const item = window.cargoData2.find(it => it.id === itemId);
    const modalContainer = document.getElementById('modal-container');

    // Determine which type of receipt to show based on item status
    const isElectronic = item.status === '已电子回单';

    modalContainer.innerHTML = `
                    <div class="modal-content" style="width: 850px; background: #fff; border-radius: 20px; padding: 0; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); display: flex; flex-direction: column; max-height: 85vh;">
                        <div style="padding: 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; background: #fff;">
                            <div>
                                <h2 style="font-size: 1.25rem; font-weight: 700; color: #1e293b;">${isElectronic ? '电子回单详情' : '回单影像查阅'}</h2>
                                <p style="font-size: 0.85rem; color: #64748b; margin-top: 4px;">货单号：${itemId}</p>
                            </div>
                            <button onclick="document.getElementById('modal-container').classList.add('hidden')" style="background: none; border: none; font-size: 1.5rem; color: #94a3b8; cursor: pointer; line-height: 1;">&times;</button>
                        </div>

                        <div style="padding: 24px; overflow-y: auto; background: #f8fafc;">
                            <!-- Receipt Info Section -->
                            <div style="background: #fff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 24px; margin-bottom: 24px;">
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px; color: #4f46e5;">
                                    <i class="fas fa-file-invoice" style="font-size: 1.1rem;"></i>
                                    <h3 style="font-size: 1rem; font-weight: 700; margin: 0;">确认信息表单</h3>
                                </div>

                                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px;">
                                    <div>
                                        <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 6px;">确认签名人</p>
                                        <p style="font-size: 1rem; font-weight: 600; color: #1e293b;">${isElectronic ? '王小二 (收货库管)' : '系统自动校验'}</p>
                                    </div>
                                    <div>
                                        <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 6px;">确认时间</p>
                                        <p style="font-size: 1rem; font-weight: 600; color: #1e293b;">${item.time}</p>
                                    </div>
                                    <div>
                                        <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 6px;">确认地点</p>
                                        <p style="font-size: 1rem; font-weight: 600; color: #1e293b;">${item.end} 某某产业园</p>
                                    </div>
                                    <div>
                                        <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 6px;">状态</p>
                                        <span style="padding: 4px 10px; background: #dcfce7; color: #166534; border-radius: 6px; font-size: 0.85rem; font-weight: 600;">已认证真实有效</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Receipt Image Section -->
                            <div style="background: #fff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 24px;">
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px; color: #4f46e5;">
                                    <i class="fas fa-camera" style="font-size: 1.1rem;"></i>
                                    <h3 style="font-size: 1rem; font-weight: 700; margin: 0;">回单照片/扫描件</h3>
                                </div>

                                <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                                    <div style="width: 240px; height: 320px; background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 12px; position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s;"
                                        onmouseover="this.style.borderColor='#4f46e5'; this.style.background='#eef2ff'" onmouseout="this.style.borderColor='#cbd5e1'; this.style.background='#f1f5f9'">

                                        <!-- Visual placeholder for a receipt document -->
                                        <div style="width: 180px; height: 240px; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 16px; display: flex; flex-direction: column; gap: 8px;">
                                            <div style="height: 12px; width: 40%; background: #e2e8f0;"></div>
                                            <div style="height: 8px; width: 90%; background: #f8fafc;"></div>
                                            <div style="height: 8px; width: 85%; background: #f8fafc;"></div>
                                            <div style="height: 1px; width: 100%; background: #f1f5f9; margin: 8px 0;"></div>
                                            <div style="flex: 1; display: flex; align-items: flex-end; justify-content: flex-end;">
                                                <div style="width: 60px; height: 60px; border-radius: 50%; border: 2px solid #ef4444; opacity: 0.3; display: flex; align-items: center; justify-content: center; color: #ef4444; font-size: 0.6rem; transform: rotate(-15deg);">已收讫</div>
                                            </div>
                                        </div>
                                        <div style="margin-top: 12px; font-size: 0.8rem; color: #64748b; font-weight: 600;">回单正面.jpg</div>
                                    </div>

                                    <div style="width: 240px; height: 320px; background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 12px; position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s;"
                                        onmouseover="this.style.borderColor='#4f46e5'; this.style.background='#eef2ff'" onmouseout="this.style.borderColor='#cbd5e1'; this.style.background='#f1f5f9'">
                                        <i class="fas fa-plus" style="font-size: 2rem; color: #94a3b8; margin-bottom: 12px;"></i>
                                        <p style="font-size: 0.85rem; color: #64748b;">查看更多细节</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style="padding: 16px 24px; background: #fff; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; gap: 12px;">
                            <button class="btn" onclick="document.getElementById('modal-container').classList.add('hidden')" style="padding: 10px 24px; border: 1px solid #e2e8f0; border-radius: 10px; font-weight: 600;">关闭</button>
                            <button class="btn btn-primary" style="padding: 10px 24px; border-radius: 10px; font-weight: 600; background: #5345ec;" onclick="showToast('正在调起打印组件...')"><i class="fas fa-print"></i> 打印存根</button>
                        </div>
                    </div>
                    `;
    modalContainer.classList.remove('hidden');
    modalContainer.style.display = 'flex';
};

window.deleteCargo2 = (id) => {
    if (confirm('是否确认删除该草稿？确认后数据将移至回收站。')) {
        const item = window.cargoData2.find(it => it.id === id);
        if (item) {
            item.status = '回收站';
            item.statusText = '回收站';
            item.actions = ['恢复', '彻底删除'];
            showToast('已移至回收站');
            renderCargoManagement2(document.getElementById('view-container'));
        }
    }
};

window.cancelCargo2 = (id, isAccepted) => {
    const msg = isAccepted
        ? '该货单已接单，取消将影响您的货主评价星级分，是否确认取消？'
        : '是否确认取消该货单？';

    if (confirm(msg)) {
        const item = window.cargoData2.find(it => it.id === id);
        if (item) {
            item.status = '已取消';
            item.statusText = '已取消';
            item.actions = ['查看', '恢复'];
            showToast('货单已取消');
            renderCargoManagement2(document.getElementById('view-container'));
        }
    }
};

// Helper for rendering horizontal tracking timeline
function renderTrackTimeline(container, trackPoints) {
    if (!trackPoints || trackPoints.length === 0) {
        container.innerHTML = '<div style="color:#94a3b8; text-align:center; padding: 20px;">暂无轨迹数据</div>';
        return;
    }

    container.innerHTML = `
                    <div style="font-weight: 700; color: #1e293b; display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                        <i class="fas fa-route" style="color: #4f46e5;"></i> 物流轨迹信息
                    </div>
                    <div style="background: #fafbfc; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; max-height: 300px; overflow-y: auto;">
                        ${trackPoints.map((point, index) => `
                <div style="display: flex; gap: 16px; position: relative; padding-bottom: 24px;">
                    ${index !== trackPoints.length - 1 ? `<div style="position: absolute; left: 7px; top: 20px; bottom: 0; width: 2px; background: #e2e8f0;"></div>` : ''}
                    <div style="width: 16px; height: 16px; border-radius: 50%; background: ${index === 0 ? '#4f46e5' : '#e2e8f0'}; border: 3px solid #fff; box-shadow: 0 0 0 1px ${index === 0 ? '#4f46e5' : '#e2e8f0'}; z-index: 1; flex-shrink: 0; margin-top: 4px;"></div>
                    <div>
                        <div style="font-weight: 700; color: ${index === 0 ? '#1e293b' : '#64748b'}; font-size: 0.95rem;">${point.status} <span style="font-weight: 400; font-size: 0.8rem; margin-left: 8px; color: #94a3b8;">${point.time}</span></div>
                        <div style="font-weight: 600; color: #334155; font-size: 0.85rem; margin: 4px 0;">${point.location}</div>
                        <div style="font-size: 0.85rem; color: #64748b; line-height: 1.4;">${point.desc}</div>
                    </div>
                </div>
            `).join('')}
                    </div>
                    `;
}
// --- Page Rendering Implementations ---

// Render Cargo Detail Page
window.renderCargoDetailPage = (container, cargoId, params = {}) => {
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
                    <div onclick="window.navigateTo('waybillDetail', { id: '${wb.id}', from: 'cargoList' })" 
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
                <button class="btn" onclick="window.navigateTo('${params.from || 'cargoList'}')" style="background: white; border: 1px solid #e2e8f0; padding: 8px 12px; white-space: nowrap;">
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
                    <span class="status-badge" style="${window.getStatusStyle ? window.getStatusStyle(item.statusText) : ''}">${item.statusText}</span>
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
                    <div class="form-group">
                        <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;"><span style="color:red">*</span>装货地</label>
                        <input type="text" id="input-start" value="${item.start}" placeholder="请选择装货地" readonly 
                               ${isEditMode ? 'onclick="window.openMapModal(\'input-start\')"' : 'disabled'} 
                               style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; cursor: ${isEditMode ? 'pointer' : 'default'}; background: ${isEditMode ? 'white' : '#f8fafc'};">
                    </div>
                    <div class="form-group">
                        <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px;"><span style="color:red">*</span>卸货地</label>
                        <input type="text" id="input-end" value="${item.end}" placeholder="请选择卸货地" readonly 
                               ${isEditMode ? 'onclick="window.openMapModal(\'input-end\')"' : 'disabled'} 
                               style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; cursor: ${isEditMode ? 'pointer' : 'default'}; background: ${isEditMode ? 'white' : '#f8fafc'};">
                    </div>
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
window.renderWaybillDetailPage = (container, waybillId, params = {}) => {
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

    // Fallback: Search in global waybillData (from Waybill Management module)
    if (!waybill && window.waybillData) {
        waybill = window.waybillData.find(w => w.id === waybillId);
    }

    if (!waybill) {
        showToast('找不到运单数据');
        window.switchView('cargo-management-2');
        return;
    }

    container.innerHTML = `
        <div class="page-header" style="margin-bottom: 24px;">
            <div class="page-title" style="display: flex; align-items: center; gap: 12px;">
                <button class="btn" onclick="window.navigateTo('${params.from || 'cargoList'}')" style="background: white; border: 1px solid #e2e8f0; padding: 8px 12px; white-space: nowrap;">
                    <i class="fas fa-arrow-left"></i> 返回
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

// Render Contract Detail Page
window.renderContractDetailPage = (container, contractId, params = {}) => {
    const contract = (window.contractData || []).find(it => it.id === contractId);
    if (!contract) {
        showToast('找不到合同数据');
        window.switchView(params.from || 'contract-management');
        return;
    }

    container.innerHTML = `
        <div class="page-header" style="margin-bottom: 24px;">
            <div class="page-title" style="display: flex; align-items: center; gap: 12px;">
                <button class="btn" onclick="window.navigateTo('${params.from || 'contract-management'}')" style="background: white; border: 1px solid #e2e8f0; padding: 8px 12px; white-space: nowrap;">
                    <i class="fas fa-arrow-left"></i> 返回
                </button>
                <div>
                    <h1 style="margin: 0;">合同文件详情</h1>
                    <p style="margin: 4px 0 0 0;">合同编号: <span style="font-family: monospace;">${contract.id}</span></p>
                </div>
            </div>
            <div>
                 <span class="status-chip ${contract.status === 'active' ? 'status-active' : ''}" style="background: ${contract.status === 'expired' ? '#f1f5f9' : ''}; color: ${contract.status === 'expired' ? '#94a3b8' : ''}; font-size: 0.85rem; font-weight: 600; padding: 6px 12px; border-radius: 20px;">
                    ${contract.statusText}
                </span>
            </div>
        </div>

        <div style="max-width: 900px; margin: 0 auto; display: grid; gap: 24px;">
            <div class="card" style="padding: 32px; border-radius: 16px; box-shadow: var(--shadow-sm); background: white; min-height: 500px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid #e2e8f0;">
                <div style="text-align: center; margin-bottom: 40px;">
                    <div style="width: 80px; height: 80px; background: #eef2ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: #4f46e5;">
                        <i class="fas fa-file-contract" style="font-size: 2.5rem;"></i>
                    </div>
                    <h2 style="font-size: 1.5rem; font-weight: 700; color: #1e293b; margin: 0;">${contract.name}</h2>
                    <p style="color: #64748b; margin-top: 12px;">这是一份受法律保护的电子合同文档</p>
                </div>
                
                <div style="width: 100%; max-width: 600px; border-top: 1px solid #f1f5f9; padding-top: 32px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
                        <div>
                            <label style="color: #64748b; font-size: 0.85rem; display: block; margin-bottom: 4px;">签署方 (甲方)</label>
                            <div style="font-weight: 700; color: #1e293b;">丰源智慧物流平台</div>
                        </div>
                        <div>
                            <label style="color: #64748b; font-size: 0.85rem; display: block; margin-bottom: 4px;">签署方 (乙方)</label>
                            <div style="font-weight: 700; color: #1e293b;">${contract.signer || '当前注册货主'}</div>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
                        <div>
                            <label style="color: #64748b; font-size: 0.85rem; display: block; margin-bottom: 4px;">开始日期</label>
                            <div style="font-weight: 600;">${contract.date}</div>
                        </div>
                        <div>
                            <label style="color: #64748b; font-size: 0.85rem; display: block; margin-bottom: 4px;">到期日期</label>
                            <div style="font-weight: 600;">${contract.expireDate || '长期有效'}</div>
                        </div>
                    </div>
                    
                    <div style="background: #f8fbff; border: 1px solid #e0e7ff; padding: 24px; border-radius: 16px; display: flex; align-items: center; justify-content: space-between;">
                        <div>
                            <p style="font-weight: 700; color: #4338ca; margin: 0;">合同正本.pdf</p>
                            <p style="font-size: 0.8rem; color: #6366f1; margin: 4px 0 0 0;">PDF 文档 · 2.4 MB · 已通过 CA 认证</p>
                        </div>
                        <div style="display: flex; gap: 12px;">
                            <button class="btn" style="background: white; border: 1px solid #e2e8f0; color: #4f46e5; border-radius: 8px;" onclick="window.previewContract('${contract.id}')">
                                <i class="fas fa-eye"></i> 预览
                            </button>
                            <button class="btn btn-primary" style="border-radius: 8px;" onclick="window.downloadContract('${contract.id}')">
                                <i class="fas fa-download"></i> 下载
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card" style="padding: 24px; border-radius: 12px; background: #fff7ed; border: 1px solid #ffedd5;">
                <div style="display: flex; gap: 12px;">
                    <i class="fas fa-shield-alt" style="color: #ea580c; font-size: 1.2rem;"></i>
                    <div>
                        <h4 style="color: #9a3412; margin: 0 0 4px 0;">安全提示</h4>
                        <p style="color: #c2410c; font-size: 0.85rem; margin: 0; line-height: 1.5;">
                            本合同受电子签名法保护，具有完整法律效力。请勿私自将合同文件泄露给第三方。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
};

// --- Helper Functions for Features ---

// Toggle Action Menu
window.toggleActionMenu = (id) => {
    const menu = document.getElementById(`action-menu-${id}`);
    if (menu) {
        // Close others
        document.querySelectorAll('.action-menu').forEach(m => {
            if (m.id !== `action-menu-${id}`) m.classList.add('hidden');
        });
        menu.classList.toggle('hidden');
        menu.style.display = menu.classList.contains('hidden') ? 'none' : 'block';
    }
};

// Global click to close menus
document.addEventListener('click', (e) => {
    if (!e.target.closest('.action-menu') && !e.target.closest('.btn-text')) {
        document.querySelectorAll('.action-menu').forEach(m => {
            m.classList.add('hidden');
            m.style.display = 'none';
        });
    }
});

// Mock Filter Logic
window.filterCargoList = () => {
    const client = document.getElementById('filter-client').value.toLowerCase();
    const start = document.getElementById('filter-start').value.toLowerCase();
    const end = document.getElementById('filter-end').value.toLowerCase();

    // In a real app, this would re-fetch or re-filter the main data source
    // For now, we simulate a "Filtered" toast because the render function pulls from window.cargoData2 directly
    // To make it real, we'd need to update a `currentFilters` state and re-render.

    // Let's implement a simple stateful filter for demo
    window.currentCargoFilters = { client, start, end };
    renderCargoManagement2(document.getElementById('view-container'));
};


// Helper to render action menu to avoid template literal nesting issues
window.renderActionMenu = (item, primaryCount = 2) => {
    // Normalize: Consolidate '查看'/'修改' into '详情'
    let actions = [];
    let hasDetail = false;
    (item.actions || []).forEach(a => {
        if (['查看', '修改', '详情'].includes(a)) {
            if (!hasDetail) { actions.push('详情'); hasDetail = true; }
        } else {
            actions.push(a);
        }
    });

    // START CHANGE: If 3 or more actions, force primaryCount to 1 (Details + More)
    if (actions.length >= 3) {
        primaryCount = 1;
    }
    // END CHANGE

    const getHandler = (a) => {
        if (a === '详情') {
            if (item.id.startsWith('CON-')) return `window.navigateTo('contractDetail', {id: '${item.id}', from: 'contract-management'})`;
            return `window.navigateTo('cargoDetail', {id: '${item.id}', from: 'cargoList'})`;
        }
        if (a === '预览') return `window.previewContract('${item.id}')`;
        if (a === '下载') return `window.downloadContract('${item.id}')`;
        if (['查看轨迹', '轨迹'].includes(a)) return `window.viewOrderTrack('${item.id}')`;
        if (['查看回单', '回单'].includes(a)) return `window.viewCargo2Receipt('${item.id}')`;
        if (['评价司机', '评价'].includes(a)) return `window.openCargo2ReviewModal('${item.id}')`;
        if (a === '删除') {
            if (item.id.startsWith('CON-')) return `showToast('删除功能开发中')`;
            return `window.deleteCargo2('${item.id}')`;
        }
        if (a === '取消') return `window.cancelCargo2('${item.id}', ${item.statusText === '已接单'})`;
        if (a === '再来一单') return `window.openPublishCargoModal('reorder', '${item.id}')`;
        return `showToast('${a}操作成功')`;
    };

    const primaryActions = actions.slice(0, primaryCount);
    const moreActions = actions.slice(primaryCount);

    const primaryHtml = primaryActions.map(a => `
        <button class="btn-text" style="color: #4f46e5; font-weight: 600;" onclick="event.stopPropagation(); ${getHandler(a)}">
            ${a}
        </button>
    `).join('');

    let moreHtml = '';
    if (moreActions.length > 0) {
        const menuItems = moreActions.map(m => `
            <button class="dropdown-item-btn" onclick="event.stopPropagation(); ${getHandler(m)}">
                ${m}
            </button>
        `).join('');

        // Updated to use CSS Hover Dropdown
        moreHtml = `
            <div class="action-dropdown" onclick="event.stopPropagation()">
                <div class="action-dropdown-trigger">
                    更多 <i class="fas fa-chevron-down" style="font-size: 0.7rem;"></i>
                </div>
                <div class="action-dropdown-menu">
                    <div style="display: flex; flex-direction: column;">
                        ${menuItems}
                    </div>
                </div>
            </div>
        `;
    }

    return `
        <div style="display: flex; align-items: center; gap: 8px;">
            ${primaryHtml}
            ${moreHtml}
        </div>
    `;
};

window.renderConsignorRecharge = (container) => {
    // 1. Data Prep
    const balance = window.walletData.balance.toFixed(2); // e.g. "12580.00"
    const [whole, decimal] = balance.split('.');

    // 2. HTML Template
    container.innerHTML = `
        <div class="page-header">
            <div class="page-title">
                <h1>货主充值</h1>
                <p>管理您的账户余额，支持在线充值与提现。</p>
            </div>
            <div class="page-actions">
                <button class="btn" style="background: white; border: 1px solid #e2e8f0; color: #64748b;"><i class="fas fa-history"></i> 交易记录</button>
            </div>
        </div>

        <!-- Wallet Card -->
        <div class="wallet-card">
            <div class="balance-label">
                <i class="fas fa-wallet"></i> 账户余额 (元)
                <i class="fas fa-eye" id="balance-eye" style="cursor: pointer; opacity: 0.7; margin-left: 8px;"></i>
            </div>
            <div class="balance-amount" id="balance-display">
                ${whole}<small>.${decimal}</small>
            </div>
            <div class="wallet-actions">
                <button class="wallet-btn primary" id="btn-recharge">
                    <i class="fas fa-plus"></i> 立即充值
                </button>
                <button class="wallet-btn" id="btn-withdraw">
                    <i class="fas fa-arrow-down"></i> 余额提现
                </button>
            </div>
        </div>

        <!-- Transactions -->
        <div class="card">
            <div class="card-header">
                <h3>最近交易</h3>
                <a href="#" style="font-size: 0.8rem; color: var(--primary-color);">查看全部</a>
            </div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>交易时间</th>
                        <th>类型</th>
                        <th>说明</th>
                        <th>金额</th>
                        <th>状态</th>
                    </tr>
                </thead>
                <tbody>
                    ${window.walletData.transactions.length > 0 ? window.walletData.transactions.map(t => `
                        <tr>
                            <td>${t.time}</td>
                            <td>${t.title}</td>
                            <td>${t.type === 'recharge' ? '银行卡充值' : (t.type === 'withdraw' ? '提现至银行卡' : '运费支付')}</td>
                            <td style="font-weight: bold; color: ${t.amount > 0 ? '#10b981' : '#ef4444'}">
                                ${t.amount > 0 ? '+' : ''}${t.amount.toFixed(2)}
                            </td>
                            <td><span class="status-chip status-active">成功</span></td>
                        </tr>
                    `).join('') : '<tr><td colspan="5" style="text-align:center; padding: 40px; color: var(--text-muted);">暂无交易记录</td></tr>'}
                </tbody>
            </table>
        </div>

        <!-- Recharge Panel Overlay (Ported) -->
        <div class="recharge-backdrop" id="recharge-backdrop"></div>
        <div class="recharge-panel" id="recharge-panel">
            <button class="close-panel-btn" id="close-recharge"><i class="fas fa-times"></i></button>
            
            <div class="step-indicator">
                <div class="step active" id="step-1">
                    <div class="step-circle">1</div>
                    <div class="step-text">选择金额</div>
                </div>
                <div class="step" id="step-2">
                    <div class="step-circle">2</div>
                    <div class="step-text">支付方式</div>
                </div>
                <div class="step" id="step-3">
                    <div class="step-circle">3</div>
                    <div class="step-text">完成</div>
                </div>
            </div>

            <!-- Step 1: Amount -->
            <div id="recharge-step-1">
                <div class="amount-selection">
                    <h3>充值金额</h3>
                    <div class="amount-options" id="amount-options">
                        <div class="amount-option selected" data-value="1000">
                            <div class="amount-value">1,000</div>
                            <div class="amount-note">元</div>
                        </div>
                        <div class="amount-option" data-value="2000">
                            <div class="amount-value">2,000</div>
                            <div class="amount-note">元</div>
                        </div>
                        <div class="amount-option" data-value="5000">
                            <div class="amount-value">5,000</div>
                            <div class="amount-note">送50元券</div>
                        </div>
                        <div class="amount-option" data-value="10000">
                            <div class="amount-value">10,000</div>
                            <div class="amount-note">送200元券</div>
                        </div>
                        <div class="amount-option" data-value="20000">
                            <div class="amount-value">20,000</div>
                            <div class="amount-note">送500元券</div>
                        </div>
                        <div class="amount-option" data-value="custom">
                            <div class="amount-value">其他</div>
                            <div class="amount-note">自定义</div>
                        </div>
                    </div>
                    <div class="custom-amount hidden" id="custom-amount-input-div">
                        <h4>输入金额</h4>
                        <input type="number" id="custom-amount-input" class="form-input" placeholder="请输入充值金额 (最低100元)">
                    </div>
                </div>
                <div class="action-buttons">
                    <div style="flex:1"></div>
                    <button class="btn btn-primary" id="btn-next-step" style="width: 120px; justify-content: center;">下一步</button>
                </div>
            </div>

            <!-- Step 2: Payment -->
            <div id="recharge-step-2" class="hidden">
                 <div class="payment-methods">
                    <h3>支付方式</h3>
                    <div class="payment-options">
                        <div class="payment-option selected" data-pay="alipay">
                            <div class="payment-icon alipay"><i class="fab fa-alipay"></i></div>
                            <div class="payment-info">
                                <h4>支付宝</h4>
                                <p>推荐支付宝用户使用</p>
                            </div>
                        </div>
                        <div class="payment-option" data-pay="wechat">
                            <div class="payment-icon wechat"><i class="fab fa-weixin"></i></div>
                            <div class="payment-info">
                                <h4>微信支付</h4>
                                <p>亿万用户的选择</p>
                            </div>
                        </div>
                        <div class="payment-option" data-pay="bank">
                            <div class="payment-icon bank"><i class="fas fa-university"></i></div>
                            <div class="payment-info">
                                <h4>企业网银</h4>
                                <p>大额转账推荐</p>
                            </div>
                        </div>
                    </div>
                 </div>
                 <div class="action-buttons">
                    <button class="btn" id="btn-prev-step" style="border: 1px solid #e2e8f0; background: white;">上一步</button>
                    <button class="btn btn-primary" id="btn-confirm-pay" style="flex:1; justify-content: center;">确认支付 <span id="pay-amount-display" style="margin-left:8px;"></span></button>
                 </div>
            </div>

            <!-- Step 2.5: QR Code Payment -->
            <div id="recharge-step-qr" class="hidden" style="text-align: center; padding: 20px;">
                <h3 id="qr-pay-title" style="margin-bottom: 20px; font-size: 1.2rem;">请使用手机扫码支付</h3>
                <div style="background: white; padding: 20px; display: inline-block; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                    <!-- Placeholder for QR Code - Using a generic icon approach or could be an image -->
                    <div style="width: 200px; height: 200px; background: #f8fafc; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; border: 1px dashed #cbd5e1;">
                         <i class="fas fa-qrcode" style="font-size: 80px; color: #334155;"></i>
                    </div>
                    <p style="color: #64748b; font-size: 0.9rem;">支付金额: <span id="qr-pay-amount" style="font-weight: bold; color: #0f172a;"></span></p>
                </div>
                <div style="margin-top: 30px;">
                    <p style="margin-bottom: 16px; color: #64748b;">扫码支付后，请点击下方按钮</p>
                    <button class="btn btn-primary" id="btn-qr-paid" style="padding: 10px 40px;">我已完成支付</button>
                    <button class="btn" id="btn-qr-back" style="margin-left: 10px; background: #f1f5f9; color: #64748b;">选择其他方式</button>
                </div>
            </div>

            <!-- Step 3: Success -->
            <div id="recharge-step-3" class="hidden">
                <div class="success-message">
                    <div class="success-icon"><i class="fas fa-check"></i></div>
                    <h2>充值成功</h2>
                    <p style="color: #64748b; margin-top: 10px;">资金已实时到账，您现在可以进行支付。</p>
                    <button class="btn btn-primary" id="btn-finish-recharge" style="margin-top: 30px; width: 200px; justify-content: center;">完成</button>
                </div>
            </div>
        </div>
    `;

    // Injecting Withdrawal Modal into the main template
    container.innerHTML = container.innerHTML.replace('<!-- Recharge Panel Overlay (Ported) -->', `
        <!-- Withdrawal Panel Overlay -->
        <div class="recharge-backdrop" id="withdraw-backdrop"></div>
        <div class="recharge-panel" id="withdraw-panel">
            <button class="close-panel-btn" id="close-withdraw"><i class="fas fa-times"></i></button>
            <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="font-size: 1.25rem; font-weight: bold; color: #1e293b;">余额提现</h2>
                <p style="color: #64748b; font-size: 0.9rem; margin-top: 5px;">提现到银行卡</p>
            </div>
            
            <div style="margin-bottom: 25px;">
                <label style="display: block; color: #475569; font-weight: 500; margin-bottom: 10px;">提现金额</label>
                <div style="display: flex; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
                    <span style="font-size: 1.5rem; font-weight: bold; color: #1e293b; margin-right: 10px;">¥</span>
                    <input type="number" id="withdraw-amount-input" style="border: none; outline: none; font-size: 1.5rem; font-weight: bold; width: 100%; color: #1e293b;" placeholder="0.00">
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 0.85rem;">
                    <span style="color: #64748b;">可提现余额 ¥ <span id="withdraw-available-balance">0.00</span></span>
                    <button class="btn-text" id="btn-withdraw-all" style="color: var(--primary-color); font-weight: 500; border: none; background: none; cursor: pointer;">全部提现</button>
                </div>
            </div>

            <div style="margin-bottom: 30px;">
                 <label style="display: block; color: #475569; font-weight: 500; margin-bottom: 10px;">提现至</label>
                 <div id="withdraw-bank-list" style="display: flex; flex-direction: column; gap: 10px;">
                    <!-- Bank Cards Injected Here -->
                 </div>
            </div>

            <div class="action-buttons">
                <button class="btn btn-primary" id="btn-confirm-withdraw" style="width: 100%; justify-content: center; padding: 12px;">确认提现</button>
            </div>
        </div>

        <!-- Recharge Panel Overlay (Ported) -->
    `);

    // 3. Logic Binding
    // Re-use logic from app ported but adapted
    let currentAmount = 1000;

    // Balance Toggle
    const eye = document.getElementById('balance-eye');
    const display = document.getElementById('balance-display');
    let visible = true;
    eye.onclick = () => {
        visible = !visible;
        eye.className = visible ? 'fas fa-eye' : 'fas fa-eye-slash';
        if (visible) {
            const [w, d] = window.walletData.balance.toFixed(2).split('.');
            display.innerHTML = `${w}<small>.${d}</small>`;
        } else {
            display.innerHTML = '****';
        }
    };

    // Open/Close Panel
    const panel = document.getElementById('recharge-panel');
    const backdrop = document.getElementById('recharge-backdrop');
    const closeBtn = document.getElementById('close-recharge');

    document.getElementById('btn-recharge').onclick = () => {
        panel.classList.add('active');
        backdrop.classList.add('active');
        resetRechargeFlow();
    };

    const closeRecharge = () => {
        panel.classList.remove('active');
        backdrop.classList.remove('active');
    };
    closeBtn.onclick = closeRecharge;
    backdrop.onclick = closeRecharge;

    // Amount Selection
    const options = document.querySelectorAll('.amount-option');
    const customInputDiv = document.getElementById('custom-amount-input-div');
    const customInput = document.getElementById('custom-amount-input');

    options.forEach(opt => {
        opt.onclick = () => {
            options.forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            const val = opt.getAttribute('data-value');
            if (val === 'custom') {
                customInputDiv.classList.remove('hidden');
                currentAmount = 0;
            } else {
                customInputDiv.classList.add('hidden');
                currentAmount = parseInt(val);
                customInput.value = '';
            }
        };
    });

    customInput.oninput = (e) => {
        currentAmount = parseFloat(e.target.value) || 0;
    };

    // Steps Logic
    const step1 = document.getElementById('recharge-step-1');
    const step2 = document.getElementById('recharge-step-2');
    const step3 = document.getElementById('recharge-step-3'); // success only
    const stepIndicator2 = document.getElementById('step-2');
    const stepIndicator3 = document.getElementById('step-3');

    document.getElementById('btn-next-step').onclick = () => {
        if (currentAmount <= 0) {
            // Using a simple alert for now
            alert('请选择或输入有效的充值金额');
            return;
        }
        step1.classList.add('hidden');
        step2.classList.remove('hidden');
        stepIndicator2.classList.add('active');
        document.getElementById('pay-amount-display').innerText = '¥ ' + currentAmount.toFixed(2);
    };

    document.getElementById('btn-prev-step').onclick = () => {
        step2.classList.add('hidden');
        step1.classList.remove('hidden');
        stepIndicator2.classList.remove('active');
    };

    // Payment Confirm (Simulation)
    // Payment Confirm & QR Logic
    const stepQr = document.getElementById('recharge-step-qr');
    const qrTitle = document.getElementById('qr-pay-title');
    const qrAmount = document.getElementById('qr-pay-amount');

    document.getElementById('btn-confirm-pay').onclick = () => {
        // Handle Payment Option Selection
        const selectedPay = document.querySelector('.payment-option.selected')?.getAttribute('data-pay') || 'alipay';

        if (['alipay', 'wechat'].includes(selectedPay)) {
            // Show QR Code Step
            step2.classList.add('hidden');
            stepQr.classList.remove('hidden');

            qrAmount.innerText = '¥ ' + currentAmount.toFixed(2);
            if (selectedPay === 'alipay') {
                qrTitle.innerText = '请使用支付宝扫码支付';
                qrTitle.style.color = '#1677ff'; // Alipay Blue
            } else {
                qrTitle.innerText = '请使用微信扫码支付';
                qrTitle.style.color = '#07c160'; // WeChat Green
            }
            return;
        }

        // Bank Transfer or other direct methods (Transition directly to success simulation)
        const btn = document.getElementById('btn-confirm-pay');
        const originalContent = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 处理中...';

        setTimeout(() => {
            finishPaymentSuccess();
        }, 1200);
    };

    // QR Code Page Buttons
    document.getElementById('btn-qr-paid').onclick = () => {
        const btn = document.getElementById('btn-qr-paid');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 确认中...';

        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '我已完成支付';
            stepQr.classList.add('hidden');
            finishPaymentSuccess();
        }, 1000);
    };

    document.getElementById('btn-qr-back').onclick = () => {
        stepQr.classList.add('hidden');
        step2.classList.remove('hidden');
    };

    const finishPaymentSuccess = () => {
        window.walletData.balance += currentAmount;
        window.walletData.transactions.unshift({
            id: Date.now(),
            type: 'recharge',
            title: '快充值',
            time: new Date().toLocaleString(),
            amount: currentAmount,
            status: 'success'
        });

        step2.classList.add('hidden'); // ensure step2 is hidden
        stepQr.classList.add('hidden'); // ensure qr is hidden
        step3.classList.remove('hidden');
        stepIndicator2.classList.add('completed');
        stepIndicator2.classList.remove('active');
        stepIndicator3.classList.add('completed');
        stepIndicator3.classList.add('active');

        // Refresh balance label if visible
        if (visible) {
            const [w, d] = window.walletData.balance.toFixed(2).split('.');
            display.innerHTML = `${w}<small>.${d}</small>`;
        }
    };

    document.getElementById('btn-finish-recharge').onclick = () => {
        closeRecharge();
        // Re-render to show transaction update
        setTimeout(() => renderConsignorRecharge(container), 300);
    };

    const resetRechargeFlow = () => {
        step1.classList.remove('hidden');
        step2.classList.add('hidden');
        if (stepQr) stepQr.classList.add('hidden'); // Reset QR step
        step3.classList.add('hidden');
        stepIndicator2.classList.remove('active');
        stepIndicator2.classList.remove('completed');
        stepIndicator3.classList.remove('active');
        stepIndicator3.classList.remove('completed');

        // Reset amount
        currentAmount = 1000;
        options.forEach(o => o.classList.remove('selected'));
        options[0].classList.add('selected'); // Default 1000 is first
        customInputDiv.classList.add('hidden');
        customInput.value = '';

        // Reset button
        const btn = document.getElementById('btn-confirm-pay');
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '确认支付 <span id="pay-amount-display"></span>';
        }

        // Reset Payment Option
        document.querySelectorAll('.payment-option').forEach(p => p.classList.remove('selected'));
        const firstPay = document.querySelector('.payment-option');
        if (firstPay) firstPay.classList.add('selected');
    };

    // Payment Option Select Logic
    document.querySelectorAll('.payment-option').forEach(p => {
        p.onclick = () => {
            document.querySelectorAll('.payment-option').forEach(x => x.classList.remove('selected'));
            p.classList.add('selected');
        }
    });

    // Withdraw (Minimal Implementation)
    // Withdraw Logic
    const wPanel = document.getElementById('withdraw-panel');
    const wBackdrop = document.getElementById('withdraw-backdrop');
    const wClose = document.getElementById('close-withdraw');
    const wInput = document.getElementById('withdraw-amount-input');
    const wAvail = document.getElementById('withdraw-available-balance');
    const wAllBtn = document.getElementById('btn-withdraw-all');
    const wConfirm = document.getElementById('btn-confirm-withdraw');
    const wList = document.getElementById('withdraw-bank-list');

    let availableAmount = 0;

    document.getElementById('btn-withdraw').onclick = () => {
        wPanel.classList.add('active');
        wBackdrop.classList.add('active');

        // Calculate Frozen Funds
        if (!window.waybillData) renderOrderStatus(document.createElement('div')); // Init data if needed
        const frozenAmount = window.waybillData
            .filter(order => !['settled', 'cancelled'].includes(order.status))
            .reduce((sum, order) => sum + (order.freight || 0), 0);

        availableAmount = Math.max(0, window.walletData.balance - frozenAmount);

        // Update UI
        // wAvail.innerText = window.walletData.balance.toFixed(2); 
        wAvail.innerHTML = `${availableAmount.toFixed(2)} <span style="font-size: 0.8rem; color: #f59e0b; margin-left: 5px;">(冻结: ¥${frozenAmount.toFixed(2)})</span>`;

        wInput.value = '';
        renderBankCards();
    };

    const closeWithdraw = () => {
        wPanel.classList.remove('active');
        wBackdrop.classList.remove('active');
    };
    wClose.onclick = closeWithdraw;
    wBackdrop.onclick = (e) => {
        if (e.target === wBackdrop) closeWithdraw();
    };

    wAllBtn.onclick = () => {
        wInput.value = availableAmount.toFixed(2);
    };

    const renderBankCards = () => {
        wList.innerHTML = window.walletData.bankCards.map((card, index) => `
            <div class="bank-card-item ${index === 0 ? 'selected' : ''}" onclick="selectBankCard(this)" style="display: flex; align-items: center; padding: 12px; border: 1px solid ${index === 0 ? 'var(--primary-color)' : '#e2e8f0'}; border-radius: 8px; cursor: pointer; background: ${index === 0 ? '#eff6ff' : 'white'};">
                <div class="bank-icon" style="width: 32px; height: 32px; background: #e2e8f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                    <i class="fas fa-university" style="color: #64748b;"></i>
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 500; color: #1e293b;">${card.bankName}</div>
                    <div style="font-size: 0.85rem; color: #64748b;">尾号 ${card.cardNumber} ${card.cardType}</div>
                </div>
                ${index === 0 ? '<i class="fas fa-check-circle" style="color: var(--primary-color);"></i>' : ''}
            </div>
        `).join('');
    };

    // Global helper for selection (since strict mode might block inline onclick finding local func)
    window.selectBankCard = (el) => {
        const siblings = el.parentElement.children;
        for (let sib of siblings) {
            sib.classList.remove('selected');
            sib.style.borderColor = '#e2e8f0';
            sib.style.background = 'white';
            const check = sib.querySelector('.fa-check-circle');
            if (check) check.remove();
        }
        el.classList.add('selected');
        el.style.borderColor = 'var(--primary-color)';
        el.style.background = '#eff6ff';
        el.innerHTML += '<i class="fas fa-check-circle" style="color: var(--primary-color);"></i>';
    };

    wConfirm.onclick = () => {
        const amount = parseFloat(wInput.value);
        if (!amount || amount <= 0) {
            alert('请输入有效的提现金额');
            return;
        }
        if (amount > availableAmount) {
            if (amount <= window.walletData.balance) {
                alert('可用余额不足（部分资金因在途运单已被冻结）');
            } else {
                alert('余额不足');
            }
            return;
        }

        wConfirm.disabled = true;
        wConfirm.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 处理中...';

        setTimeout(() => {
            wConfirm.disabled = false;
            wConfirm.innerHTML = '确认提现';

            // Success Logic
            window.walletData.balance -= amount;
            window.walletData.transactions.unshift({
                id: Date.now(),
                type: 'withdraw',
                title: '余额提现',
                time: new Date().toLocaleString(),
                amount: -amount,
                status: 'success'
            });

            closeWithdraw();
            // Re-render
            renderConsignorRecharge(container);

            // Show toast/alert
            // Simple Alert or Toast if available. Using alert for now as per style.
            alert('提现申请已提交，资金将原路返回您的账户。');
        }, 1200);
    };
};
