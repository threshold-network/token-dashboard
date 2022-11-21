import PageLayout from "../PageLayout"
import { PageComponent } from "../../types"
import UsabilitySurvey from "./UsabilitySurvey"
import Suggestions from "./Suggestions"
import BugReport from "./BugReport"
import Settings from "./Settings"
import { featureFlags } from "../../constants"

const FeedbackPage: PageComponent = (props) => {
  return <PageLayout title={props.title} pages={props.pages} />
}

FeedbackPage.route = {
  path: "feedback",
  index: true,
  pages: [UsabilitySurvey, Suggestions, BugReport, Settings],
  title: "Feedback",
  isPageEnabled: featureFlags.FEEDBACK_MODULE,
}

export default FeedbackPage
