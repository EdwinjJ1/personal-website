import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "pipeline"))
from sync_github import build, count_of, parse_calendar, to_view  # noqa: E402


def day(i, date, level):
    return (f'<td tabindex="0" data-ix="{i}" aria-selected="false" style="width: 10px" data-date="{date}" '
            f'id="contribution-day-component-{i}" data-level="{level}" role="gridcell" data-view-component="true" class="ContributionCalendar-day"></td>')


def tip(i, text):
    return f'<tool-tip id="tooltip-{i}" for="contribution-day-component-{i}" popover="manual" class="sr-only">{text}</tool-tip>'


# 和 github.com/users/<用户>/contributions 的结构一样：一行大字、每天一个 td、tool-tip 里是次数；故意打乱顺序
PAGE = "\n".join([
    '<h2 tabindex="-1" id="js-contribution-activity-description" class="f4 text-normal mb-2">',
    '      1,250', '      contributions', '        in the last year', '</h2>',
    day(2, "2026-10-03", 4), day(0, "2026-10-01", 0), day(1, "2026-10-02", 1),
    '<td class="ContributionCalendar-label">Mon</td>',
    tip(0, "No contributions on October 1st."), tip(1, "1 contribution on October 2nd."), tip(2, "1,249 contributions on October 3rd."),
])


class CountOf(unittest.TestCase):
    def test_tooltip_wording(self):
        self.assertEqual(count_of("No contributions on October 19th."), 0)
        self.assertEqual(count_of("1 contribution on November 9th."), 1)
        self.assertEqual(count_of("26 contributions on October 18th."), 26)
        self.assertEqual(count_of("1,234 contributions on May 1st."), 1234)
        self.assertEqual(count_of(""), 0)
        self.assertEqual(count_of(None), 0)


class ParseCalendar(unittest.TestCase):
    def test_days_are_sorted_and_counted(self):
        cal = parse_calendar(PAGE)
        self.assertEqual(cal["total"], 1250)
        self.assertEqual(cal["days"], [("2026-10-01", 0, 0), ("2026-10-02", 1, 1), ("2026-10-03", 1249, 4)])

    def test_total_falls_back_to_the_sum(self):
        cal = parse_calendar(day(0, "2026-01-01", 2) + tip(0, "7 contributions on January 1st."))
        self.assertEqual(cal["total"], 7)

    def test_garbage_is_ignored(self):
        self.assertEqual(parse_calendar("<html>rate limited</html>"), {"total": 0, "days": []})
        bad = '<td data-date="soon" data-level="x" class="ContributionCalendar-day"></td>'
        self.assertEqual(parse_calendar(bad)["days"], [])


class ToView(unittest.TestCase):
    cal = {"total": 9, "days": [("2026-02-26", 1, 1), ("2026-02-27", 0, 0), ("2026-03-02", 8, 4), ("2026-03-03", 5, 3)]}

    def test_gaps_are_filled_and_shape_is_flat(self):
        v = to_view("2026", self.cal)
        self.assertEqual((v["id"], v["total"], v["from"], v["to"]), ("2026", 9, "2026-02-26", "2026-03-03"))
        self.assertEqual(v["counts"], [1, 0, 0, 0, 8, 5])          # 2 月 28 日、3 月 1 日没在页面上：补 0
        self.assertEqual(v["levels"], "100043")

    def test_days_after_today_are_dropped(self):
        v = to_view("2026", self.cal, today="2026-03-02")
        self.assertEqual(v["to"], "2026-03-02")
        self.assertEqual(len(v["counts"]), len(v["levels"]))
        self.assertIsNone(to_view("2026", self.cal, today="2025-12-31"))

    def test_input_is_not_mutated(self):
        before = [d for d in self.cal["days"]]
        to_view("2026", self.cal, today="2026-02-27")
        self.assertEqual(self.cal["days"], before)


class Build(unittest.TestCase):
    def test_document_shape(self):
        v = to_view("last", parse_calendar(PAGE))
        doc = build("EdwinjJ1", [v, None], {"repos": 3, "followers": 4, "since": "2024-04-08"}, "2026-10-18T00:00:00+00:00")
        self.assertEqual(doc["url"], "https://github.com/EdwinjJ1")
        self.assertEqual([x["id"] for x in doc["views"]], ["last"])     # 抓不到的年份（None）不进文件
        self.assertEqual(doc["profile"]["repos"], 3)


if __name__ == "__main__":
    unittest.main()
