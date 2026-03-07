import { defineStore } from 'pinia'

export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    employees: []
  }),

  getters: {
    totalEmployees: (state) => state.employees.length,

    activeEmployees: (state) =>
      state.employees.filter(emp => emp.status === 'Active').length,

    totalDepartments: (state) =>
      [...new Set(state.employees.map(emp => emp.department))].length,

    averageSalary: (state) => {
      if (!state.employees.length) return 0
      const total = state.employees.reduce((sum, emp) => sum + emp.salary, 0)
      return Math.round(total / state.employees.length)
    }
  },

  actions: {
    async fetchEmployees() {
      this.employees = await $fetch('/data/employees.json')
    }
  }
})