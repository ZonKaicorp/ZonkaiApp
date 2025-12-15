// profile.js — Perfil Profissional (Corrigido)
document.addEventListener("DOMContentLoaded", () => {
  const elements = {
    avatar: document.getElementById("profile-avatar"),
    editBtn: document.querySelector(".avatar-edit-btn"),
    saveBtn: document.getElementById("save-btn"),
    fullname: document.getElementById("profile-fullname"),
    email: document.getElementById("profile-email"),
    bio: document.getElementById("profile-bio"),
    website: document.getElementById("social-website"),
    github: document.getElementById("social-github"),
    linkedin: document.getElementById("social-linkedin"),
    twitter: document.getElementById("social-twitter"),
    darkmode: document.getElementById("pref-darkmode"),
    notifications: document.getElementById("pref-notifications"),
    publicProfile: document.getElementById("pref-public")
  };
  
  let hasChanges = false;
  
  // Carregar dados do localStorage
  const loadData = () => {
    const fields = [
      { key: "fullname", el: elements.fullname },
      { key: "email", el: elements.email },
      { key: "bio", el: elements.bio },
      { key: "website", el: elements.website, type: "value" },
      { key: "github", el: elements.github, type: "value" },
      { key: "linkedin", el: elements.linkedin, type: "value" },
      { key: "twitter", el: elements.twitter, type: "value" },
      { key: "darkmode", el: elements.darkmode, type: "checked" },
      { key: "notifications", el: elements.notifications, type: "checked" },
      { key: "public", el: elements.publicProfile, type: "checked" },
      { key: "avatar", el: elements.avatar, type: "img" }
    ];
    
    fields.forEach(field => {
      const value = localStorage.getItem(field.key);
      if (value !== null && field.el) {
        if (field.type === "img") {
          field.el.innerHTML = `<img src="${value}" alt="Avatar">`;
        } else if (field.type === "checked") {
          field.el.checked = value === "true";
        } else if (field.type === "value") {
          field.el.value = value;
        } else {
          field.el.textContent = value;
        }
      }
    });
  };
  
  // Detectar mudanças
  const detectChange = () => {
    hasChanges = true;
    elements.saveBtn.disabled = false;
  };
  
  // Salvar campo
  const saveField = (key, value) => {
    localStorage.setItem(key, value);
  };
  
  // Salvar tudo
  const saveAll = () => {
    elements.saveBtn.innerHTML = `<span class="material-icons-outlined">autorenew</span> Salvando...`;
    elements.saveBtn.disabled = true;
    
    setTimeout(() => {
      saveField("fullname", elements.fullname.textContent);
      saveField("email", elements.email.textContent);
      saveField("bio", elements.bio.textContent);
      saveField("website", elements.website.value);
      saveField("github", elements.github.value);
      saveField("linkedin", elements.linkedin.value);
      saveField("twitter", elements.twitter.value);
      saveField("darkmode", elements.darkmode.checked);
      saveField("notifications", elements.notifications.checked);
      saveField("public", elements.publicProfile.checked);
      
      elements.saveBtn.innerHTML = `<span class="material-icons-outlined">check</span> Salvo!`;
      setTimeout(() => {
        elements.saveBtn.innerHTML = `<span class="material-icons-outlined">save</span> Salvar Alterações`;
        elements.saveBtn.disabled = true;
        hasChanges = false;
      }, 1200);
    }, 600);
  };
  
  // Upload de avatar
  elements.editBtn.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();
    
    input.onchange = () => {
      const file = input.files[0];
      if (!file || !file.type.startsWith("image/")) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = `<img src="${e.target.result}" alt="Avatar">`;
        elements.avatar.innerHTML = img;
        localStorage.setItem("avatar", e.target.result);
        detectChange();
      };
      reader.readAsDataURL(file);
    };
  });
  
  // Edição inline e inputs
  document.querySelectorAll(".editable").forEach(el => {
    el.addEventListener("input", detectChange);
  });
  
  // Switches
  [elements.darkmode, elements.notifications, elements.publicProfile].forEach(cb => {
    cb.addEventListener("change", detectChange);
  });
  
  // Salvar
  elements.saveBtn.addEventListener("click", saveAll);
  
  // Inicializar
  loadData();
});