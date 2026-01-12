// 等待页面加载完成后初始化Vue
document.addEventListener('DOMContentLoaded', () => {
  // 解构Vue的核心API
  const { createApp, ref, onMounted, onUnmounted } = Vue;

  // 创建Vue应用
  createApp({
    setup() {
      // 1. 定义响应式数据
      const loading = ref(false);   // 加载状态
      const errorMsg = ref('');     // 错误提示
      const hotList = ref([]);      // 热搜列表
      let timer = null;             // 定时器（定时刷新）

      // 2. 后端接口地址（和之前的Flask后端保持一致）
      const API_URL = 'http://localhost:5000/bilibili';

      // 3. 核心函数：请求后端接口获取热搜数据
      const fetchHotData = async () => {
        loading.value = true;
        errorMsg.value = '';
        try {
          // 调用后端接口
          const response = await axios.get(API_URL);
          const res = response.data;

          // 接口返回成功
          if (res.code === 200) {
            hotList.value = res.data;
          } else {
            errorMsg.value = res.msg;
          }
        } catch (err) {
          // 捕获网络错误/接口异常
          errorMsg.value = '网络错误，无法连接后端';
          console.error('请求热搜失败：', err);
        } finally {
          loading.value = false;
        }
      };

      // 4. 生命周期：页面挂载时初始化
      onMounted(() => {
        // 首次加载数据
        fetchHotData();
        // 定时刷新（每30秒更新一次，可自行调整）
        timer = setInterval(fetchHotData, 30 * 1000);
      });

      // 5. 生命周期：页面卸载时清除定时器（防止内存泄漏）
      onUnmounted(() => {
        if (timer) clearInterval(timer);
      });

      // 6. 暴露给模板的变量/方法
      return {
        loading,
        errorMsg,
        hotList,
        fetchHotData
      };
    }
  }).mount('#app');  // 挂载到HTML中的#app容器
});
