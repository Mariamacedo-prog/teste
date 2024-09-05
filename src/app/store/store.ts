import { createReducer, on, createAction, props } from '@ngrx/store';

export interface AuthState {
  isLoggedIn: boolean;
  user: any;
  permissions: any; 
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  permissions: {}
};

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: any }>()
);

export const logOutSuccess = createAction(
   '[Auth] Logout Success'
);

export const setPermissions = createAction(
  '[Auth] Set Permissions',
  props<{ permissions: any }>()
);

export const authReducer = createReducer(
  initialState,
  on(loginSuccess, (state, { user }) => ({
    ...state,
    isLoggedIn: true,
    user: user
  })),
  on(logOutSuccess, (state) => ({
    ...state,
    isLoggedIn: false,
    user: null, 
    permissions: {}
  })),
  on(setPermissions, (state, { permissions }) => ({
    ...state,
    permissions: permissions
  }))
);

