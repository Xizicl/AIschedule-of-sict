function scheduleHtmlParser(html) {
    //除函数名外都可编辑
    //传入的参数为上一步函数获取到的html
    //可使用正则匹配
    //可使用解析dom匹配，工具内置了$，跟jquery使用方法一样，直接用就可以了，参考：https://juejin.im/post/5ea131f76fb9a03c8122d6b9
    var courses = []

    const startTime = ['08:30', "09:25", "10:20", "11:15", "13:30", "14:25",
        "15:20", "16:05", "17:30", "18:15"]
    const endTime = ["09:15", "10:05", "11:05", "12:00", "14:15", "15:05",
        "16:05", "16:50", "18:15", "19:00"]

    var sectionTime = [
        {
            "section": 1,
            "startTime": startTime[0],
            "endTime": endTime[0]
        },
        {
            "section": 2,
            "startTime": startTime[1],
            "endTime": endTime[1]
        },
        {
            "section": 3,
            "startTime": startTime[2],
            "endTime": endTime[2]
        },
        {
            "section": 4,
            "startTime": startTime[3],
            "endTime": endTime[3]
        },
        {
            "section": 5,
            "startTime": startTime[4],
            "endTime": endTime[4]
        },
        {
            "section": 6,
            "startTime": startTime[5],
            "endTime": endTime[5]
        },
        {
            "section": 7,
            "startTime": startTime[6],
            "endTime": endTime[6]
        },
        {
            "section": 8,
            "startTime": startTime[7],
            "endTime": endTime[7]
        },
        {
            "section": 9,
            "startTime": startTime[8],
            "endTime": endTime[8]
        },
        {
            "section": 10,
            "startTime": startTime[9],
            "endTime": endTime[9]
        }
    ];
    // 匹配课程信息
    var reg1 = /TaskActivity\(actTeacherId.join\(','\),actTeacherName.join\(','\),"(.*)","(.*)\(.*\)","(.*)","(.*)","(.*)",null,null,assistantName,"",""\);((?:\s*index =\d+\*unitCount\+\d+;\s*.*\s)+)/g
    // 匹配上课第几节和上课的周几
    var reg2 = /\s*index =(\d+)\*unitCount\+(\d+);\s*/
    function strWeekstoArrayWeeks(str) {
        var weeksArray = new Array();
        for (let i = 0; i < str.length + 1; i++) {
            if (i == 0) {
                continue;
            } else if (str[i] == 1) {
                weeksArray.push(i)
            }
        }
        return weeksArray
    }

    //匹配老师名字与课程信息
    var reg3 = /<td>(\d)<\/td>\s*<td>([:alpha:].+)<\/td>\s*<td>(.+)<\/td>\s*<td>((\d)|(\d\.\d))<\/td>\s*<td>\s*<a href=.*\s.*\s.*\s.*>.*<\/a>\s*<\/td>\s*<td>(.*)<\/td>/ig;
    var reg4 = /<td>([^>]*)<\/td>$/ig
    var reg5 = />([^>]*)<\/a>/ig
    var myTeachers = {}
    while (teancherStr = reg3.exec(html)) {
        //         console.log(teancherStr)
        var myTeacher = {}
        myTeacher.CourseID = teancherStr[2]
        myTeacher.CourseName = teancherStr[3]
        // 		myTeacher.CourseCredit = teacher[3][1]
        myTeacher.CourseTeacher = teancherStr[7].replace(/<\/td><td>/, "")

        myTeachers[myTeacher.CourseName] = myTeacher
        //todo
        //         myTeachers[myTeacher.CourseID] = myTeacher
    }
    //     console.info(myTeachers)

    while (courseStr = reg1.exec(html)) {
        var courseInfos = {
            "name": "",
            "position": "",
            "teacher": "",
            "weeks": [],
            "day": "",
            "sections": [],
        }

        courseInfos.CourseID = courseStr[1]
        courseInfos.name = courseStr[2]
        //         courseInfos.RoomID = courseStr[3]
        courseInfos.position = courseStr[4]

        courseInfos.teacher = ((myTeachers[courseInfos.name] != undefined ? myTeachers[courseInfos.name] : { "CourseTeacher": undefined })["CourseTeacher"] != undefined) ? myTeachers[courseInfos.name].CourseTeacher : "null"

        courseInfos.weeks = strWeekstoArrayWeeks(courseStr[5])
        var indexStr = courseStr[6].split("table0.activities[index][table0.activities[index].length]=activity;")
        //         console.log(indexStr)
        for (indexs of indexStr) {
            if (indexs.search("index") == -1) {
                continue;
            } else {
                courseInfos.day = Number(reg2.exec(indexStr)[1]) + 1 >= 8 ? 0 : Number(reg2.exec(indexStr)[1]) + 1

                courseInfos.sections.push({ "section": Number((reg2.exec(indexs))[2]) + 1 })
            }
        }
        courses.push(courseInfos)
        //         console.log(courseInfos)
    }
    console.log(courses)

    return { courseInfos: courses, sectionTime: sectionTime }
}