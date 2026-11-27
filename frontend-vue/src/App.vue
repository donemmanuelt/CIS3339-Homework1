<script setup>
</script>

<template>
  <div class="app">
    <header>
      <h1>Student Management System</h1>

      <nav>
        <RouterLink to="/">Students</RouterLink>
        <RouterLink to="/courses">Courses</RouterLink>
        <RouterLink to="/enrollments">Enrollments</RouterLink>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>
