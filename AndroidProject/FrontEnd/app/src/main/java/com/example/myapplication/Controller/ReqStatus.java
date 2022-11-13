package com.example.myapplication.Controller;

public class ReqStatus {
    private enum Status {
        INITIAL,
        LOADING,
        SUCCESS,
        ERROR
    }

    private Status status;

    public ReqStatus() {
        status = Status.INITIAL;
    }

    public void loading() {
        status = Status.LOADING;
    }

    public void success() {
        status = Status.SUCCESS;
    }

    public void error() {
        status = Status.ERROR;
    }

    public boolean isLoading() {
        return status == Status.LOADING;
    }

    public boolean isError() {
        return status == Status.ERROR;
    }

}
