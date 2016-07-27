require(["jquery", "./_layout"],
    function ($) {
        $("#myform").submit(function (e) {
            alert("sub");
            if (!confirm("Are you sure??")) {
                e.preventDefault();
            }
        });

        $("#lol").on("submit", function () {
            var c = confirm("Are you sure ??");
            return c;
        });

    }
  );
