#!/bin/bash

## 本脚本用于build代码到dev环境，作为测试&联调前发布代码使用

echo_fail_info_and_exit() {
    if [ $? != 0 ]
    then
        echo ${1}
        exit ${2}
    fi
}

## 拉取最新代码
update_fe_module() {
    ## 拉取最新代码
    printf "update最新代码...\n"
    svn update
    echo_fail_info_and_exit "【update最新代码】失败，请排查问题后重新执行脚本" 1
}

## 删除指定的模块并提交
rm_output_module() {
    printf "删除老代码...\n"
    cd ../amazingday-aws-build
    svn update
    echo_fail_info_and_exit "【update老代码】失败，请排查问题后重新执行脚本" 2
    rm -r amazingday-dev
    #svn add * --force
    echo_fail_info_and_exit "【删除老代码】失败，请排查问题后重新执行脚本" 3
}

## 重新编译指定的模块并提交
update_output_module(){
    printf "编译代码...\n"
    cd ../aws
    npm run build
    echo_fail_info_and_exit "【编译代码】失败，请排查问题后重新执行脚本" 4
    printf "提交编译代码...\n"
    cd ../amazingday-aws-build
    svn add amazingday-dev --force
    svn commit amazingday-dev -m "commit dev"
    printf '提交完成\n'
    echo_fail_info_and_exit "【提交编译代码】失败，请排查问题后重新执行脚本" 5
    printf '恭喜你，操作成功！\n'
}

## 开始工作
update_fe_module
rm_output_module
update_output_module
