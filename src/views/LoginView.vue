<!-- src/views/LoginView.vue -->
<template>
  <div class="login-page">
    <div class="login-box">
      <h2>智能机器人工程数据管理系统</h2>
      <h3>用户登录</h3>
      
      <el-form ref="formRef" :model="form" :rules="rules">
        <el-form-item prop="username">
          <el-input 
            v-model="form.username" 
            placeholder="用户名" 
            prefix-icon="User"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input 
            v-model="form.password" 
            type="password" 
            placeholder="密码"
            prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            style="width: 100%" 
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="footer">
        <p>© 2023 智能机器人工程数据管理系统</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const formRef = ref(null)
    const loading = ref(false)
    
    const form = reactive({
      username: 'admin',
      password: 'admin123'
    })
    
    const rules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
      ]
    }
    
    const handleLogin = () => {
      if (!formRef.value) return
      
      formRef.value.validate((valid) => {
        if (valid) {
          loading.value = true
          
          // 模拟登录
          setTimeout(() => {
            if (form.username === 'admin' && form.password === 'admin123') {
              localStorage.setItem('token', 'mock_token')
              ElMessage.success('登录成功')
              router.push('/dashboard')
            } else {
              ElMessage.error('用户名或密码错误')
            }
            loading.value = false
          }, 1000)
        }
      })
    }
    
    return {
      formRef,
      form,
      rules,
      loading,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-page {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.login-box h2 {
  text-align: center;
  color: #333;
  margin-bottom: 10px;
}

.login-box h3 {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
  font-weight: normal;
}

.footer {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  color: #999;
  font-size: 12px;
}
</style>