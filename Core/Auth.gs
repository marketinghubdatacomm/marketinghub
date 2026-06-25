function getCurrentUser() {
  return Session.getActiveUser().getEmail();
}

function isUserAuthorized() {
  const email = getCurrentUser();
  return !!findUserByEmail(email);
}

function loginUser(email, password) {
  if (!email || !password) {
    return { success: false, error: 'Email dan password tidak boleh kosong.' };
  }

  const user = findUserByEmail(email);
  if (!user) {
    return { success: false, error: 'Email tidak terdaftar.' };
  }

  const passwordHash = safeString(user.password_hash);
  const providedHash = hashPassword(password);
  if (!passwordHash || passwordHash !== providedHash) {
    return { success: false, error: 'Email atau password salah.' };
  }

  const status = safeString(user.status).toLowerCase();
  if (status && status !== 'active' && status !== 'aktif') {
    return { success: false, error: 'Akun tidak aktif. Hubungi administrator.' };
  }

  return {
    success: true,
    user: {
      email: safeString(user.email),
      full_name: safeString(user.full_name),
      role: safeString(user.role_id)
    }
  };
}

function hashPassword(password) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password)
    .map(byte => ('0' + (byte < 0 ? byte + 256 : byte).toString(16)).slice(-2))
    .join('');
}

function getAppPage(email) {
  const userEmail = email && typeof email === 'object' ? safeString(email.email) : safeString(email);
  const user = findUserByEmail(userEmail);
  if (!user) {
    return HtmlService.createTemplateFromFile('UI/Login').evaluate().setTitle('Marketing Hub Login').getContent();
  }

  return HtmlService.createTemplateFromFile('UI/MainLayout').evaluate().setTitle('Marketing Hub').getContent();
}
