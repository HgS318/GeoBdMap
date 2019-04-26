/**
 * Created by zhujj on 2017/9/1.
 */
(function () {
    /**
     * 是否邮箱
     * @returns {boolean}
     */
    String.prototype.isEmail = function () {
        if (this.length === 0 || this.length > 50) {
            return false;
        }

        return (/^[A-Za-z0-9-_+\.]+@[A-Za-z0-9]+[A-Za-z0-9-_+]*[\.]([A-Za-z0-9-_+]+[\.]?[A-Za-z0-9-_+]*)*[A-Za-z0-9]+$/).test(this);
    };

    /**
     * 是否手机
     * @param countryCode 国家码
     * @param mobile 手机号
     * @returns {boolean}
     */
    String.prototype.isMobile = function (countryCode) {
        return checkMobileFormat(countryCode, this);
    };

    /**
     * 是否手机
     * @param separator 国家码和手机号之间的分隔符
     * @returns {boolean}
     */
    String.prototype.isMobileCombined = function (separator) {
        if (this.length === 0) {
            return false;
        }

        if (separator.length === 0) {
            return checkMobileFormat("86", this);
        }
        else {
            if (this.indexOf(separator) > 0) {
                var replaceMobile = this.replace(separator, "-");
                var phone = replaceMobile.split("-");
                return checkMobileFormat(phone[0], phone[1]);
            }
            else {
                return false;
            }
        }
    };

    /**
     * 校验手机格式
     * @param countryCode 国家码
     * @param mobile 手机号
     * @returns {boolean}
     */
    function checkMobileFormat(countryCode, mobile) {
        if (mobile.length === 0 || mobile.length > 15) {
            return false;
        }

        if (countryCode.length === 0 || countryCode === "86") {
            return (/^1([3456789]\d{9})$/).test(mobile);
        }
        else {
            return (/^\d{6,15}$/).test(mobile);
        }
    };
})();