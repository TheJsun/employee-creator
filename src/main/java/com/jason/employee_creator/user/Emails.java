package com.jason.employee_creator.user;

import java.util.Locale;

public final class Emails {

  private Emails() {}

  public static String normalise(String email) {
    return email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
  }
}
